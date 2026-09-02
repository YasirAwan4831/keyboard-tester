"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  /** Total countdown duration in milliseconds. */
  durationMs: number;
  /** Called once, exactly when remaining time reaches zero. */
  onComplete?: () => void;
}

interface UseTimerResult {
  elapsedMs: number;
  remainingMs: number;
  isRunning: boolean;
  isFinished: boolean;
  start: () => void;
  /** Freezes the timer at its current elapsed value without resetting it (e.g. test finished early). */
  stop: () => void;
  reset: () => void;
}

/**
 * A countdown timer driven by `Date.now()` timestamps rather than a
 * decrementing counter, so it stays accurate even if the tab is
 * throttled or a render is delayed — the elapsed time is always
 * `now - startedAt`, never an accumulation of small drifting steps.
 */
export function useTimer({ durationMs, onComplete }: UseTimerOptions): UseTimerResult {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const startedAtRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const tick = useCallback(() => {
    if (startedAtRef.current === null) return;
    const now = Date.now();
    const elapsed = now - startedAtRef.current;

    if (elapsed >= durationMs) {
      setElapsedMs(durationMs);
      setIsRunning(false);
      setIsFinished(true);
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }

    setElapsedMs(elapsed);
    frameRef.current = requestAnimationFrame(tick);
  }, [durationMs, onComplete]);

  const start = useCallback(() => {
    startedAtRef.current = Date.now();
    completedRef.current = false;
    setIsFinished(false);
    setIsRunning(true);
    setElapsedMs(0);
  }, []);

  const stop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    startedAtRef.current = null;
    completedRef.current = false;
    setElapsedMs(0);
    setIsRunning(false);
    setIsFinished(false);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [isRunning, tick]);

  return {
    elapsedMs,
    remainingMs: Math.max(0, durationMs - elapsedMs),
    isRunning,
    isFinished,
    start,
    stop,
    reset,
  };
}
