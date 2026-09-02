import type { AggregateStats, StoredHistory, TypingTestResult } from "@/types";
import { isBrowser, roundSafe, safeDivide } from "@/lib/utils";

const STORAGE_KEY = "keyboard-tester:history:v1";
const MAX_STORED_RESULTS = 200;

const EMPTY_HISTORY: StoredHistory = { version: 1, results: [] };

/** Type guard that validates parsed JSON actually looks like a StoredHistory. */
function isStoredHistory(value: unknown): value is StoredHistory {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StoredHistory>;
  return candidate.version === 1 && Array.isArray(candidate.results);
}

/**
 * Reads test history from localStorage. Safe to call during SSR (returns
 * empty history) and safe against corrupted/foreign JSON in the key.
 */
export function getHistory(): StoredHistory {
  if (!isBrowser()) return EMPTY_HISTORY;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_HISTORY;

    const parsed: unknown = JSON.parse(raw);
    if (!isStoredHistory(parsed)) return EMPTY_HISTORY;

    return parsed;
  } catch {
    // Corrupted JSON or localStorage unavailable (e.g. private browsing quirks) — degrade gracefully.
    return EMPTY_HISTORY;
  }
}

function persist(history: StoredHistory): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch {
    // Storage full or disabled — the app should keep working without local history.
    return false;
  }
}

/** Appends a completed test result, keeping only the most recent MAX_STORED_RESULTS. */
export function saveResult(result: TypingTestResult): StoredHistory {
  const current = getHistory();
  const results = [result, ...current.results].slice(0, MAX_STORED_RESULTS);
  const next: StoredHistory = { version: 1, results };
  persist(next);
  return next;
}

export function clearHistory(): StoredHistory {
  persist(EMPTY_HISTORY);
  return EMPTY_HISTORY;
}

export function computeAggregateStats(history: StoredHistory): AggregateStats {
  const { results } = history;

  if (results.length === 0) {
    return {
      bestWpm: 0,
      averageWpm: 0,
      bestAccuracy: 0,
      averageAccuracy: 0,
      totalTests: 0,
      lastResult: null,
    };
  }

  const bestWpm = Math.max(...results.map((r) => r.wpm));
  const bestAccuracy = Math.max(...results.map((r) => r.accuracy));
  const averageWpm = roundSafe(safeDivide(results.reduce((sum, r) => sum + r.wpm, 0), results.length));
  const averageAccuracy = roundSafe(
    safeDivide(results.reduce((sum, r) => sum + r.accuracy, 0), results.length),
    1
  );

  return {
    bestWpm,
    averageWpm,
    bestAccuracy,
    averageAccuracy,
    totalTests: results.length,
    // `results` is stored newest-first (see saveResult).
    lastResult: results[0] ?? null,
  };
}
