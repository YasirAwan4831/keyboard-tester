"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardTestMode, KeyTestResult } from "@/types";
import { US_QWERTY_LAYOUT } from "@/components/keyboard/KeyboardLayout";
import {
  applyKeyPress,
  computeDiagnostics,
  createInitialKeyStates,
  getGuidedSequence,
  markKeyFailed,
} from "@/lib/keyboard";

// Keys whose default browser behavior (page scroll) actively interferes
// with taking a keyboard test, but only when the user isn't focused on an
// interactive control (where that behavior is expected and useful).
const SCROLL_KEYS = new Set([
  "Space",
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
]);

const INTERACTIVE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"]);

export function useKeyboard() {
  const layout = US_QWERTY_LAYOUT;
  const guidedSequence = useMemo(() => getGuidedSequence(layout), [layout]);

  const [keyStates, setKeyStates] = useState<Record<string, KeyTestResult>>(() =>
    createInitialKeyStates(layout)
  );
  const [pressedCodes, setPressedCodes] = useState<Set<string>>(new Set());
  const [lastPressedCode, setLastPressedCode] = useState<string | null>(null);
  const [mode, setModeState] = useState<KeyboardTestMode>("quick");
  const [testStartedAt, setTestStartedAt] = useState<number | null>(null);
  const [guidedIndex, setGuidedIndex] = useState(0);
  const [, forceTick] = useState(0);

  const testStartedAtRef = useRef<number | null>(null);

  // Drives a live "test duration" readout without re-running key logic.
  useEffect(() => {
    if (testStartedAt === null) return;
    const interval = window.setInterval(() => forceTick((n) => n + 1), 1000);
    return () => window.clearInterval(interval);
  }, [testStartedAt]);

  const reset = useCallback(() => {
    setKeyStates(createInitialKeyStates(layout));
    setPressedCodes(new Set());
    setLastPressedCode(null);
    setTestStartedAt(null);
    testStartedAtRef.current = null;
    setGuidedIndex(0);
  }, [layout]);

  const setMode = useCallback(
    (next: KeyboardTestMode) => {
      setModeState(next);
      reset();
    },
    [reset]
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isInteractive = !!target && INTERACTIVE_TAGS.has(target.tagName);
      if (!isInteractive && SCROLL_KEYS.has(event.code)) {
        event.preventDefault();
      }

      const now = Date.now();
      if (testStartedAtRef.current === null) {
        testStartedAtRef.current = now;
        setTestStartedAt(now);
      }

      setLastPressedCode(event.code);

      // event.repeat (holding a key down) and duplicate keydowns for a key
      // that's already registered as pressed are both ignored here — the
      // key already counts as tested from its first genuine press.
      setPressedCodes((prev) => {
        if (prev.has(event.code)) return prev;
        const next = new Set(prev);
        next.add(event.code);
        return next;
      });

      if (!event.repeat) {
        setKeyStates((prev) => applyKeyPress(prev, event.code, now));

        setGuidedIndex((prevIndex) => {
          if (guidedSequence[prevIndex] === event.code) {
            return Math.min(prevIndex + 1, guidedSequence.length);
          }
          return prevIndex;
        });
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      setPressedCodes((prev) => {
        if (!prev.has(event.code)) return prev;
        const next = new Set(prev);
        next.delete(event.code);
        return next;
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [guidedSequence]);

  const skipGuidedKey = useCallback(() => {
    setGuidedIndex((prev) => Math.min(prev + 1, guidedSequence.length));
  }, [guidedSequence.length]);

  const markGuidedKeyFailed = useCallback(() => {
    const code = guidedSequence[guidedIndex];
    if (!code) return;
    setKeyStates((prev) => markKeyFailed(prev, code));
    setGuidedIndex((prev) => Math.min(prev + 1, guidedSequence.length));
  }, [guidedSequence, guidedIndex]);

  const diagnostics = useMemo(
    () => computeDiagnostics(keyStates, layout, testStartedAt),
    [keyStates, layout, testStartedAt]
  );

  return {
    layout,
    keyStates,
    pressedCodes,
    lastPressedCode,
    mode,
    setMode,
    guidedSequence,
    guidedIndex,
    guidedTargetCode: guidedIndex < guidedSequence.length ? guidedSequence[guidedIndex] ?? null : null,
    isGuidedComplete: guidedIndex >= guidedSequence.length,
    skipGuidedKey,
    markGuidedKeyFailed,
    diagnostics,
    reset,
  };
}
