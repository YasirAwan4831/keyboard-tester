"use client";

import { useCallback, useEffect, useState } from "react";
import type { AggregateStats, StoredHistory, TypingTestResult } from "@/types";
import { clearHistory, computeAggregateStats, getHistory, saveResult } from "@/lib/storage";

interface UseLocalStorageResult {
  history: StoredHistory;
  aggregateStats: AggregateStats;
  /** False until the client has read localStorage — avoids an SSR/CSR content mismatch. */
  isLoaded: boolean;
  addResult: (result: TypingTestResult) => void;
  clear: () => void;
}

/**
 * The single React-facing entry point for local test history. Components
 * never call `lib/storage.ts` directly — they read and mutate through here,
 * so localStorage access stays in one place.
 */
export function useLocalStorage(): UseLocalStorageResult {
  const [history, setHistory] = useState<StoredHistory>({ version: 1, results: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setIsLoaded(true);
  }, []);

  const addResult = useCallback((result: TypingTestResult) => {
    setHistory(saveResult(result));
  }, []);

  const clear = useCallback(() => {
    setHistory(clearHistory());
  }, []);

  return {
    history,
    aggregateStats: computeAggregateStats(history),
    isLoaded,
    addResult,
    clear,
  };
}
