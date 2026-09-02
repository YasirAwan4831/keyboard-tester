import type { KeyboardKey, KeyboardLayoutDefinition, KeyboardDiagnostics, KeyTestResult } from "@/types";
import { getAllKeys } from "@/components/keyboard/KeyboardLayout";

/** Creates the initial "untested" state map for every key in a layout. */
export function createInitialKeyStates(
  layout: KeyboardLayoutDefinition
): Record<string, KeyTestResult> {
  const states: Record<string, KeyTestResult> = {};
  for (const k of getAllKeys(layout)) {
    states[k.code] = {
      code: k.code,
      status: "untested",
      pressCount: 0,
      firstPressedAt: null,
      lastPressedAt: null,
    };
  }
  return states;
}

/**
 * Applies a key press to a state map, returning a new map (never mutates).
 * A key is marked "passed" the moment we see a real keydown for it — a
 * browser-delivered event is itself the evidence the key works.
 */
export function applyKeyPress(
  states: Record<string, KeyTestResult>,
  code: string,
  timestamp: number
): Record<string, KeyTestResult> {
  const existing = states[code];
  const next: KeyTestResult = existing
    ? {
        ...existing,
        status: "passed",
        pressCount: existing.pressCount + 1,
        firstPressedAt: existing.firstPressedAt ?? timestamp,
        lastPressedAt: timestamp,
      }
    : {
        code,
        status: "passed",
        pressCount: 1,
        firstPressedAt: timestamp,
        lastPressedAt: timestamp,
      };
  return { ...states, [code]: next };
}

/** Marks a key "failed" — used only by the guided test when a user explicitly reports a key as not working. */
export function markKeyFailed(
  states: Record<string, KeyTestResult>,
  code: string
): Record<string, KeyTestResult> {
  const existing = states[code];
  return {
    ...states,
    [code]: {
      code,
      status: "failed",
      pressCount: existing?.pressCount ?? 0,
      firstPressedAt: existing?.firstPressedAt ?? null,
      lastPressedAt: existing?.lastPressedAt ?? null,
    },
  };
}

export function resetKeyStates(layout: KeyboardLayoutDefinition): Record<string, KeyTestResult> {
  return createInitialKeyStates(layout);
}

export function computeDiagnostics(
  states: Record<string, KeyTestResult>,
  layout: KeyboardLayoutDefinition,
  testStartedAt: number | null
): KeyboardDiagnostics {
  const all = getAllKeys(layout);
  let tested = 0;
  let working = 0;
  let problem = 0;

  for (const k of all) {
    const state = states[k.code];
    if (!state || state.status === "untested") continue;
    tested += 1;
    if (state.status === "failed") {
      problem += 1;
    } else {
      working += 1;
    }
  }

  const lastEventAt = Object.values(states).reduce<number | null>((latest, s) => {
    if (s.lastPressedAt === null) return latest;
    if (latest === null) return s.lastPressedAt;
    return Math.max(latest, s.lastPressedAt);
  }, null);

  const testDurationMs =
    testStartedAt !== null && lastEventAt !== null ? Math.max(0, lastEventAt - testStartedAt) : 0;

  return {
    totalKeys: all.length,
    testedKeys: tested,
    untestedKeys: all.length - tested,
    workingKeys: working,
    problemKeys: problem,
    testDurationMs,
  };
}

/** Returns the ordered list of key codes a "guided" test should step through. */
export function getGuidedSequence(layout: KeyboardLayoutDefinition): string[] {
  return getAllKeys(layout)
    .filter((k) => !k.unreliable)
    .map((k) => k.code);
}

export function findKey(code: string, layout: KeyboardLayoutDefinition): KeyboardKey | undefined {
  return getAllKeys(layout).find((k) => k.code === code);
}
