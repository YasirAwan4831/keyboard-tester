import { describe, expect, it } from "vitest";
import { clamp, formatDuration, roundSafe, safeDivide } from "@/lib/utils";

describe("safeDivide", () => {
  it("divides normally", () => {
    expect(safeDivide(10, 2)).toBe(5);
  });

  it("returns the fallback for division by zero", () => {
    expect(safeDivide(10, 0)).toBe(0);
    expect(safeDivide(10, 0, -1)).toBe(-1);
  });

  it("never returns NaN or Infinity", () => {
    expect(Number.isFinite(safeDivide(0, 0))).toBe(true);
    expect(Number.isFinite(safeDivide(Infinity, 1))).toBe(true);
  });
});

describe("roundSafe", () => {
  it("rounds to the given number of decimals", () => {
    expect(roundSafe(72.456, 1)).toBe(72.5);
    expect(roundSafe(72.456)).toBe(72);
  });

  it("returns 0 for non-finite input instead of NaN", () => {
    expect(roundSafe(NaN)).toBe(0);
    expect(roundSafe(Infinity)).toBe(0);
  });
});

describe("clamp", () => {
  it("keeps values within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("formatDuration", () => {
  it("formats milliseconds as M:SS", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(65_000)).toBe("1:05");
    expect(formatDuration(125_000)).toBe("2:05");
  });

  it("clamps negative durations to zero", () => {
    expect(formatDuration(-500)).toBe("0:00");
  });
});
