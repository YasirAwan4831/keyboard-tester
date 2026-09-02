import { beforeEach, describe, expect, it } from "vitest";
import { clearHistory, computeAggregateStats, getHistory, saveResult } from "@/lib/storage";
import type { TypingTestResult } from "@/types";

function makeResult(overrides: Partial<TypingTestResult> = {}): TypingTestResult {
  return {
    id: `result-${Math.random()}`,
    timestamp: Date.now(),
    config: { duration: 30, difficulty: "medium", contentMode: "words" },
    durationMs: 30_000,
    wpm: 60,
    rawWpm: 65,
    accuracy: 96,
    correctCharacters: 300,
    incorrectCharacters: 12,
    totalCharacters: 312,
    errors: 12,
    grade: "B",
    ...overrides,
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("getHistory", () => {
  it("returns an empty history when nothing is stored", () => {
    expect(getHistory()).toEqual({ version: 1, results: [] });
  });

  it("degrades gracefully when localStorage contains corrupted JSON", () => {
    window.localStorage.setItem("keyboard-tester:history:v1", "{not valid json");
    expect(getHistory()).toEqual({ version: 1, results: [] });
  });

  it("degrades gracefully when localStorage contains an unrelated shape", () => {
    window.localStorage.setItem("keyboard-tester:history:v1", JSON.stringify({ hello: "world" }));
    expect(getHistory()).toEqual({ version: 1, results: [] });
  });
});

describe("saveResult", () => {
  it("persists a result and makes it retrievable", () => {
    const result = makeResult();
    saveResult(result);
    const history = getHistory();
    expect(history.results).toHaveLength(1);
    expect(history.results[0]?.id).toBe(result.id);
  });

  it("stores newest results first", () => {
    saveResult(makeResult({ id: "first" }));
    saveResult(makeResult({ id: "second" }));
    const history = getHistory();
    expect(history.results[0]?.id).toBe("second");
    expect(history.results[1]?.id).toBe("first");
  });
});

describe("clearHistory", () => {
  it("removes all stored results", () => {
    saveResult(makeResult());
    clearHistory();
    expect(getHistory().results).toHaveLength(0);
  });
});

describe("computeAggregateStats", () => {
  it("returns zeroed stats for empty history", () => {
    const stats = computeAggregateStats({ version: 1, results: [] });
    expect(stats.totalTests).toBe(0);
    expect(stats.bestWpm).toBe(0);
    expect(stats.lastResult).toBeNull();
  });

  it("computes best and average values correctly", () => {
    const results = [
      makeResult({ wpm: 40, accuracy: 90 }),
      makeResult({ wpm: 80, accuracy: 98 }),
    ];
    const stats = computeAggregateStats({ version: 1, results });
    expect(stats.bestWpm).toBe(80);
    expect(stats.averageWpm).toBe(60);
    expect(stats.bestAccuracy).toBe(98);
    expect(stats.totalTests).toBe(2);
  });
});
