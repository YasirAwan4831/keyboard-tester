// ---------------------------------------------------------------------------
// Keyboard types
// ---------------------------------------------------------------------------

/** Broad category a key belongs to — drives layout width and styling. */
export type KeyCategory =
  | "function"
  | "number"
  | "letter"
  | "modifier"
  | "whitespace"
  | "navigation"
  | "editing"
  | "arrow"
  | "numpad"
  | "system";

/** Static description of a single physical key, independent of test state. */
export interface KeyboardKey {
  /** Physical key identifier — matches `KeyboardEvent.code`. */
  code: string;
  /** Primary label shown on the keycap. */
  label: string;
  /** Optional secondary label (e.g. a shifted symbol) shown above the primary label. */
  secondaryLabel?: string;
  /** Category used for grouping, styling, and width calculation. */
  type: KeyCategory;
  /** Relative width in "unit" keys. A standard letter key is 1. */
  width?: number;
  /** True for keys whose browser-level detection is known to be inconsistent. */
  unreliable?: boolean;
}

/** A single row in a keyboard layout. */
export type KeyboardRowDefinition = KeyboardKey[];

/** A full, named keyboard layout made up of ordered rows. */
export interface KeyboardLayoutDefinition {
  id: string;
  name: string;
  rows: KeyboardRowDefinition[];
  /** Optional navigation cluster (Insert/Home/PageUp, Delete/End/PageDown, arrows). */
  navRows?: KeyboardRowDefinition[];
  /** Optional separate numeric keypad block, rendered beside the main block. */
  numpadRows?: KeyboardRowDefinition[];
}

/** Live status of a key during a test session. */
export type KeyStatus = "untested" | "pressed" | "passed" | "failed";

/** Runtime record of a single key's test state. */
export interface KeyTestResult {
  code: string;
  status: KeyStatus;
  pressCount: number;
  firstPressedAt: number | null;
  lastPressedAt: number | null;
}

/** Aggregate diagnostics computed from a map of KeyTestResult. */
export interface KeyboardDiagnostics {
  totalKeys: number;
  testedKeys: number;
  untestedKeys: number;
  workingKeys: number;
  problemKeys: number;
  testDurationMs: number;
}

/** The three keyboard-tester interaction modes. */
export type KeyboardTestMode = "quick" | "guided" | "manual";

// ---------------------------------------------------------------------------
// Typing test types
// ---------------------------------------------------------------------------

export type TypingDuration = 15 | 30 | 60 | 120;

export type TypingDifficulty = "easy" | "medium" | "hard";

export type TypingContentMode = "words" | "sentences" | "paragraph";

export interface TypingTestConfig {
  duration: TypingDuration;
  difficulty: TypingDifficulty;
  contentMode: TypingContentMode;
}

/** Per-character grading used to render the typing text and compute stats. */
export type CharState = "untyped" | "correct" | "incorrect" | "current";

export interface TypingStats {
  elapsedMs: number;
  remainingMs: number;
  typedCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
  correctWords: number;
  incorrectWords: number;
  backspaces: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errorRate: number;
  completionPercentage: number;
}

export type PerformanceGrade = "S" | "A" | "B" | "C" | "D";

export interface TypingTestResult {
  id: string;
  timestamp: number;
  config: TypingTestConfig;
  durationMs: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctCharacters: number;
  incorrectCharacters: number;
  totalCharacters: number;
  errors: number;
  grade: PerformanceGrade;
}

// ---------------------------------------------------------------------------
// Local storage / stats types
// ---------------------------------------------------------------------------

export interface StoredHistory {
  version: 1;
  results: TypingTestResult[];
}

export interface AggregateStats {
  bestWpm: number;
  averageWpm: number;
  bestAccuracy: number;
  averageAccuracy: number;
  totalTests: number;
  lastResult: TypingTestResult | null;
}

// ---------------------------------------------------------------------------
// API types
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HealthCheckResponse {
  status: "ok";
  service: "keyboard-tester";
  timestamp: string;
  uptimeSeconds: number;
}

/** Minimal, aggregated payload accepted by POST /api/results — never raw keystrokes. */
export interface ResultSubmission {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  duration: TypingDuration;
  difficulty: TypingDifficulty;
  correctCharacters: number;
  incorrectCharacters: number;
  errors: number;
  timestamp: number;
}

export interface LeaderboardResponse {
  mode: "local-only";
  message: string;
}
