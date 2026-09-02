import { describe, expect, it } from "vitest";
import { calculateGrade, computeStats, generateTypingText } from "@/lib/typing";
import type { TypingTestConfig } from "@/types";

const config: TypingTestConfig = { duration: 30, difficulty: "medium", contentMode: "words" };

describe("generateTypingText", () => {
  it("generates text long enough to outlast the longest test duration", () => {
    const text = generateTypingText({ ...config, duration: 120 });
    expect(text.length).toBeGreaterThan(3000);
  });

  it("generates different content for words, sentences, and paragraph modes", () => {
    const words = generateTypingText({ ...config, contentMode: "words" });
    const sentences = generateTypingText({ ...config, contentMode: "sentences" });
    const paragraph = generateTypingText({ ...config, contentMode: "paragraph" });
    expect(words).not.toBe(sentences);
    expect(sentences).not.toBe(paragraph);
  });
});

describe("computeStats", () => {
  it("reports 100% accuracy and zero WPM before any input", () => {
    const stats = computeStats({
      targetText: "the quick brown fox",
      typedText: "",
      backspaces: 0,
      elapsedMs: 0,
      totalDurationMs: 30_000,
    });
    expect(stats.wpm).toBe(0);
    expect(stats.accuracy).toBe(100);
    expect(Number.isFinite(stats.wpm)).toBe(true);
    expect(Number.isFinite(stats.accuracy)).toBe(true);
  });

  it("calculates WPM using the 5-characters-per-word standard", () => {
    // 25 correct characters typed in exactly 30 seconds (0.5 minutes) = 10 WPM.
    const stats = computeStats({
      targetText: "a".repeat(25),
      typedText: "a".repeat(25),
      backspaces: 0,
      elapsedMs: 30_000,
      totalDurationMs: 30_000,
      isFinal: true,
    });
    expect(stats.wpm).toBe(10);
    expect(stats.rawWpm).toBe(10);
    expect(stats.accuracy).toBe(100);
  });

  it("differentiates WPM (correct only) from raw WPM (all keystrokes)", () => {
    // 20 correct + 5 incorrect characters over 30 seconds.
    const target = "a".repeat(20) + "b".repeat(5);
    const typed = "a".repeat(20) + "x".repeat(5);
    const stats = computeStats({
      targetText: target,
      typedText: typed,
      backspaces: 0,
      elapsedMs: 30_000,
      totalDurationMs: 30_000,
      isFinal: true,
    });
    expect(stats.correctCharacters).toBe(20);
    expect(stats.incorrectCharacters).toBe(5);
    expect(stats.wpm).toBeLessThan(stats.rawWpm);
  });

  it("never produces NaN or Infinity, even with zero elapsed time", () => {
    const stats = computeStats({
      targetText: "hello world",
      typedText: "hello",
      backspaces: 2,
      elapsedMs: 0,
      totalDurationMs: 30_000,
    });
    for (const value of Object.values(stats)) {
      if (typeof value === "number") {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
  });

  it("clamps completion percentage to a maximum of 100", () => {
    const stats = computeStats({
      targetText: "short",
      typedText: "short and then some more",
      backspaces: 0,
      elapsedMs: 5000,
      totalDurationMs: 30_000,
    });
    expect(stats.completionPercentage).toBeLessThanOrEqual(100);
  });
});

describe("calculateGrade", () => {
  it("awards S for very high WPM and accuracy", () => {
    expect(calculateGrade(95, 98)).toBe("S");
  });

  it("awards D for low performance", () => {
    expect(calculateGrade(10, 60)).toBe("D");
  });

  it("requires both WPM and accuracy thresholds to be met", () => {
    // High WPM but poor accuracy should not earn a top grade.
    expect(calculateGrade(95, 50)).toBe("D");
  });
});
