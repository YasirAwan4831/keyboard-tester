"use client";

import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { TypingTestConfig, TypingTestResult, TypingStats } from "@/types";
import { buildResult, computeStats, generateTypingText } from "@/lib/typing";
import { useTimer } from "@/hooks/useTimer";

const DEFAULT_CONFIG: TypingTestConfig = {
  duration: 30,
  difficulty: "medium",
  contentMode: "words",
};

export type TypingTestStatus = "idle" | "running" | "finished";

interface UseTypingTestOptions {
  onFinish?: (result: TypingTestResult) => void;
}

export function useTypingTest({ onFinish }: UseTypingTestOptions = {}) {
  const [config, setConfig] = useState<TypingTestConfig>(DEFAULT_CONFIG);
  const [status, setStatus] = useState<TypingTestStatus>("idle");
  const [targetText, setTargetText] = useState<string>(() => generateTypingText(DEFAULT_CONFIG));
  const [typedText, setTypedText] = useState("");
  const [backspaces, setBackspaces] = useState(0);
  const [result, setResult] = useState<TypingTestResult | null>(null);

  const finishedRef = useRef(false);

  const finalize = useCallback(
    (finalTypedText: string, finalBackspaces: number, elapsedMs: number) => {
      if (finishedRef.current) return;
      finishedRef.current = true;

      const stats = computeStats({
        targetText,
        typedText: finalTypedText,
        backspaces: finalBackspaces,
        elapsedMs,
        totalDurationMs: config.duration * 1000,
        isFinal: true,
      });
      const finalResult = buildResult(config, stats, elapsedMs);
      setResult(finalResult);
      setStatus("finished");
      timer.stop();
      onFinish?.(finalResult);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, targetText, onFinish]
  );

  const timer = useTimer({
    durationMs: config.duration * 1000,
    onComplete: () => finalize(typedText, backspaces, config.duration * 1000),
  });

  const updateConfig = useCallback(
    (partial: Partial<TypingTestConfig>) => {
      if (status !== "idle") return;
      setConfig((prev) => {
        const next = { ...prev, ...partial };
        setTargetText(generateTypingText(next));
        return next;
      });
    },
    [status]
  );

  const start = useCallback(() => {
    finishedRef.current = false;
    setTypedText("");
    setBackspaces(0);
    setResult(null);
    setTargetText(generateTypingText(config));
    setStatus("running");
    timer.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const restart = useCallback(() => {
    timer.reset();
    finishedRef.current = false;
    setTypedText("");
    setBackspaces(0);
    setResult(null);
    setStatus("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (status === "finished") return;

      const isPrintable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
      const isBackspace = event.key === "Backspace";

      if (!isPrintable && !isBackspace) return;

      if (status === "idle") {
        if (!isPrintable) return;
        start();
      }
      event.preventDefault();

      if (isBackspace) {
        setBackspaces((prev) => prev + 1);
        setTypedText((prev) => prev.slice(0, -1));
        return;
      }

      setTypedText((prev) => {
        if (prev.length >= targetText.length) return prev;
        const next = prev + event.key;
        if (next.length >= targetText.length) {
          // Ran out of generated text — finish immediately with what was typed.
          window.setTimeout(() => finalize(next, backspaces, timer.elapsedMs), 0);
        }
        return next;
      });
    },
    [status, start, targetText.length, backspaces, timer.elapsedMs, finalize]
  );

  const stats: TypingStats = useMemo(
    () =>
      computeStats({
        targetText,
        typedText,
        backspaces,
        elapsedMs: status === "finished" && result ? result.durationMs : timer.elapsedMs,
        totalDurationMs: config.duration * 1000,
        isFinal: status === "finished",
      }),
    [targetText, typedText, backspaces, timer.elapsedMs, config.duration, status, result]
  );

  return {
    config,
    updateConfig,
    status,
    targetText,
    typedText,
    stats,
    result,
    start,
    restart,
    handleKeyDown,
    remainingMs: timer.remainingMs,
  };
}
