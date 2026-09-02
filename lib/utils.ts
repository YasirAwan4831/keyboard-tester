type ClassValue = string | number | null | undefined | false | Record<string, boolean>;

/** Minimal `clsx`-style class name combiner — avoids adding a dependency for one helper. */
export function cn(...values: ClassValue[]): string {
  const parts: string[] = [];
  for (const value of values) {
    if (!value) continue;
    if (typeof value === "string" || typeof value === "number") {
      parts.push(String(value));
      continue;
    }
    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) parts.push(key);
    }
  }
  return parts.join(" ");
}

/** Division that never produces NaN or Infinity — returns `fallback` instead. */
export function safeDivide(numerator: number, denominator: number, fallback = 0): number {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return fallback;
  }
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : fallback;
}

/** Rounds to a fixed number of decimals, guarding against NaN/Infinity. */
export function roundSafe(value: number, decimals = 0): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Formats milliseconds as `M:SS`, clamped to zero. */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Generates a reasonably unique id without pulling in a uuid dependency. */
export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}
