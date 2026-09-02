import { describe, expect, it } from "vitest";
import {
  applyKeyPress,
  computeDiagnostics,
  createInitialKeyStates,
  findKey,
  getGuidedSequence,
  markKeyFailed,
} from "@/lib/keyboard";
import { US_QWERTY_LAYOUT, getAllKeys } from "@/components/keyboard/KeyboardLayout";

describe("createInitialKeyStates", () => {
  it("marks every key in the layout as untested", () => {
    const states = createInitialKeyStates(US_QWERTY_LAYOUT);
    const allKeys = getAllKeys(US_QWERTY_LAYOUT);
    expect(Object.keys(states)).toHaveLength(allKeys.length);
    for (const key of allKeys) {
      expect(states[key.code]?.status).toBe("untested");
    }
  });
});

describe("applyKeyPress", () => {
  it("marks a key as passed on its first press", () => {
    const states = createInitialKeyStates(US_QWERTY_LAYOUT);
    const next = applyKeyPress(states, "KeyA", 1000);
    expect(next.KeyA?.status).toBe("passed");
    expect(next.KeyA?.pressCount).toBe(1);
    expect(next.KeyA?.firstPressedAt).toBe(1000);
  });

  it("increments press count on subsequent presses without resetting firstPressedAt", () => {
    let states = createInitialKeyStates(US_QWERTY_LAYOUT);
    states = applyKeyPress(states, "KeyA", 1000);
    states = applyKeyPress(states, "KeyA", 2000);
    expect(states.KeyA?.pressCount).toBe(2);
    expect(states.KeyA?.firstPressedAt).toBe(1000);
    expect(states.KeyA?.lastPressedAt).toBe(2000);
  });

  it("does not mutate the original state map", () => {
    const states = createInitialKeyStates(US_QWERTY_LAYOUT);
    const originalStatus = states.KeyA?.status;
    applyKeyPress(states, "KeyA", 1000);
    expect(states.KeyA?.status).toBe(originalStatus);
  });
});

describe("markKeyFailed", () => {
  it("marks a key as failed", () => {
    const states = createInitialKeyStates(US_QWERTY_LAYOUT);
    const next = markKeyFailed(states, "F1");
    expect(next.F1?.status).toBe("failed");
  });
});

describe("computeDiagnostics", () => {
  it("counts working and untested keys correctly", () => {
    let states = createInitialKeyStates(US_QWERTY_LAYOUT);
    states = applyKeyPress(states, "KeyA", 1000);
    states = applyKeyPress(states, "KeyB", 1200);
    states = markKeyFailed(states, "F1");

    const diagnostics = computeDiagnostics(states, US_QWERTY_LAYOUT, 1000);
    expect(diagnostics.workingKeys).toBe(2);
    expect(diagnostics.problemKeys).toBe(1);
    expect(diagnostics.testedKeys).toBe(3);
    expect(diagnostics.untestedKeys).toBe(diagnostics.totalKeys - 3);
  });

  it("reports zero duration when no test has started", () => {
    const states = createInitialKeyStates(US_QWERTY_LAYOUT);
    const diagnostics = computeDiagnostics(states, US_QWERTY_LAYOUT, null);
    expect(diagnostics.testDurationMs).toBe(0);
  });
});

describe("getGuidedSequence", () => {
  it("excludes keys marked unreliable", () => {
    const sequence = getGuidedSequence(US_QWERTY_LAYOUT);
    expect(sequence).not.toContain("PrintScreen");
    expect(sequence).toContain("KeyA");
  });
});

describe("findKey", () => {
  it("finds a key definition by code", () => {
    const key = findKey("Enter", US_QWERTY_LAYOUT);
    expect(key?.label).toBe("Enter");
  });

  it("returns undefined for an unknown code", () => {
    expect(findKey("NotARealKey", US_QWERTY_LAYOUT)).toBeUndefined();
  });
});
