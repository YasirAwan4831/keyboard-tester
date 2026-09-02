import type {
  PerformanceGrade,
  TypingContentMode,
  TypingDifficulty,
  TypingTestConfig,
  TypingTestResult,
  TypingStats,
} from "@/types";
import { clamp, generateId, roundSafe, safeDivide } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Content banks
// ---------------------------------------------------------------------------
// Difficulty changes what you actually have to type, not just the label:
// easy stays short and lowercase, medium introduces longer words and normal
// punctuation, hard adds capitals, numbers, and denser punctuation.

const WORDS_EASY = [
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "her",
  "was", "one", "our", "out", "day", "get", "has", "him", "his", "how",
  "man", "new", "now", "old", "see", "two", "way", "who", "boy", "did",
  "cat", "dog", "run", "sun", "top", "cup", "map", "big", "red", "hot",
  "sit", "pen", "box", "ice", "key", "arm", "leg", "eye", "ear", "car",
];

const WORDS_MEDIUM = [
  "keyboard", "diagnostic", "practice", "consistent", "browser", "signal",
  "typing", "accuracy", "measure", "session", "shortcut", "response",
  "backspace", "modifier", "layout", "detect", "reliable", "feedback",
  "performance", "duration", "sentence", "paragraph", "character", "average",
  "history", "storage", "network", "monitor", "device", "software",
  "physical", "virtual", "gesture", "cursor", "focus", "toggle",
  "interface", "gradient", "component", "function", "variable", "compile",
];

const WORDS_HARD = [
  "asynchronous", "throughput", "encapsulation", "idempotent", "polymorphism",
  "concurrency", "serialization", "middleware", "authentication", "dependency",
  "orchestration", "abstraction", "heuristic", "recursive", "immutable",
  "namespace", "configuration", "instantiate", "bandwidth", "cryptography",
  "Node.js", "TypeScript's", "O(n log n)", "127.0.0.1", "v2.3.1",
  "well-typed", "self-hosted", "co-located", "e-commerce", "re-render",
];

const SENTENCES_EASY = [
  "The cat sat on the mat and did not move.",
  "I like to read a book at the end of the day.",
  "We went to the park to play in the sun.",
  "She has a red car and a small dog.",
  "He can run very fast down the long road.",
  "The sky is blue and the grass is green.",
  "They ate lunch at noon and then took a walk.",
  "My best friend lives just two blocks away.",
];

const SENTENCES_MEDIUM = [
  "Typing quickly is useful, but typing accurately matters just as much.",
  "A reliable keyboard should register every keystroke without any delay.",
  "Most typing tests measure both your speed and your overall accuracy.",
  "Practice a little every day, and your typing speed will improve steadily.",
  "The quick brown fox jumps over the lazy dog near the old fence.",
  "Good posture and proper hand placement can make typing far more comfortable.",
  "Browsers handle keyboard events slightly differently across operating systems.",
  "A well-designed interface gives the user immediate and honest feedback.",
];

const SENTENCES_HARD = [
  "Given the 2024 benchmark, throughput increased by 37.5% after the refactor.",
  "\"Don't trust user input,\" the senior engineer said, \"validate everything twice!\"",
  "The API returned a 404 error because the endpoint's path had changed.",
  "Config values (e.g., API_KEY, DB_URL) should never be committed to Git.",
  "She asked, \"Can you review PR #482 before the 3:00 PM stand-up?\"",
  "Edge-cases—like empty strings, null values, or NaN—must be handled explicitly.",
  "The invoice total came to $1,249.99, due within 30 days of receipt.",
  "Use `KeyboardEvent.code`, not the deprecated `keyCode`, for physical detection.",
];

const PARAGRAPHS_EASY = [
  "Learning to type well takes time. It helps to sit up straight and rest your fingers on the home row. Try not to look down at the keys. With enough practice, your hands will learn where every key is.",
  "A good typing habit starts with small steps. Type a little bit every day. Focus on getting the letters right before you try to go fast. Speed will come naturally once accuracy feels easy.",
];

const PARAGRAPHS_MEDIUM = [
  "Modern keyboards send two kinds of information for every key press: a physical code that identifies the key's position, and a character value that depends on the current layout and modifier keys. Understanding the difference is important when building any tool that needs to detect real key presses reliably.",
  "Typing speed is usually measured in words per minute, where a word is standardized as five characters, including spaces. This keeps the measurement fair even when someone types unusually long or short words. Accuracy is just as important as speed, since a fast typist who makes constant mistakes may not actually be more productive.",
];

const PARAGRAPHS_HARD = [
  "When designing a typing-test engine, timestamps should always be used instead of a simple decrementing counter, because naive intervals drift under load and produce an inaccurate duration. Likewise, statistics such as WPM and accuracy must be computed defensively: dividing by zero, or by an elapsed time of zero minutes, should never surface as NaN or Infinity in the interface.",
  "Browser-level keyboard detection has real limitations—some keys (like PrintScreen, or certain media keys) are inconsistently reported across operating systems and browsers, and virtual keyboards on touch devices may not fire the same events at all. A trustworthy diagnostic tool should say a key was \"not detected during this test,\" never that the hardware is \"definitely broken.\"",
];

function pickBank(mode: "words", difficulty: TypingDifficulty): string[];
function pickBank(mode: "sentences" | "paragraph", difficulty: TypingDifficulty): string[];
function pickBank(mode: TypingContentMode, difficulty: TypingDifficulty): string[] {
  const banks: Record<TypingContentMode, Record<TypingDifficulty, string[]>> = {
    words: { easy: WORDS_EASY, medium: WORDS_MEDIUM, hard: WORDS_HARD },
    sentences: { easy: SENTENCES_EASY, medium: SENTENCES_MEDIUM, hard: SENTENCES_HARD },
    paragraph: { easy: PARAGRAPHS_EASY, medium: PARAGRAPHS_MEDIUM, hard: PARAGRAPHS_HARD },
  };
  return banks[mode][difficulty];
}

function randomItem<T>(items: T[]): T {
  const value = items[Math.floor(Math.random() * items.length)];
  // Non-null: `items` is always a non-empty content bank defined above.
  return value as T;
}

/**
 * Generates a target text long enough to outlast even a very fast typist
 * across the longest available duration (120s), so the engine never runs
 * out of text mid-test.
 */
const MIN_TEXT_LENGTH = 3500;

export function generateTypingText(config: TypingTestConfig): string {
  const { contentMode, difficulty } = config;

  if (contentMode === "words") {
    const bank = pickBank("words", difficulty);
    const words: string[] = [];
    let length = 0;
    while (length < MIN_TEXT_LENGTH) {
      const word = randomItem(bank);
      words.push(word);
      length += word.length + 1;
    }
    return words.join(" ");
  }

  const bank = contentMode === "sentences" ? pickBank("sentences", difficulty) : pickBank("paragraph", difficulty);
  const parts: string[] = [];
  let length = 0;
  while (length < MIN_TEXT_LENGTH) {
    const part = randomItem(bank);
    parts.push(part);
    length += part.length + 1;
  }
  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface ComputeStatsInput {
  targetText: string;
  typedText: string;
  backspaces: number;
  elapsedMs: number;
  totalDurationMs: number;
  isFinal?: boolean;
}

function countWordStats(typedText: string, targetText: string, isFinal: boolean) {
  const typedWords = typedText.length > 0 ? typedText.split(" ") : [];
  const targetWords = targetText.split(" ");
  const countUpTo = isFinal ? typedWords.length : Math.max(0, typedWords.length - 1);

  let correct = 0;
  let incorrect = 0;
  for (let i = 0; i < countUpTo; i++) {
    const typedWord = typedWords[i] ?? "";
    if (typedWord.length === 0) continue;
    const targetWord = targetWords[i] ?? "";
    if (typedWord === targetWord) correct += 1;
    else incorrect += 1;
  }
  return { correct, incorrect };
}

export function computeStats(input: ComputeStatsInput): TypingStats {
  const { targetText, typedText, backspaces, elapsedMs, totalDurationMs, isFinal = false } = input;

  const typedCharacters = typedText.length;
  let correctCharacters = 0;
  for (let i = 0; i < typedCharacters; i++) {
    if (typedText[i] === targetText[i]) correctCharacters += 1;
  }
  const incorrectCharacters = typedCharacters - correctCharacters;

  const elapsedMinutes = elapsedMs / 60000;
  const wpm = elapsedMinutes > 0 ? roundSafe(safeDivide(correctCharacters / 5, elapsedMinutes)) : 0;
  const rawWpm = elapsedMinutes > 0 ? roundSafe(safeDivide(typedCharacters / 5, elapsedMinutes)) : 0;

  const accuracy = typedCharacters === 0 ? 100 : roundSafe(safeDivide(correctCharacters, typedCharacters) * 100, 1);
  const errorRate = typedCharacters === 0 ? 0 : roundSafe(safeDivide(incorrectCharacters, typedCharacters) * 100, 1);

  const { correct: correctWords, incorrect: incorrectWords } = countWordStats(typedText, targetText, isFinal);

  const completionPercentage = clamp(roundSafe(safeDivide(typedCharacters, targetText.length) * 100, 1), 0, 100);

  return {
    elapsedMs,
    remainingMs: Math.max(0, totalDurationMs - elapsedMs),
    typedCharacters,
    correctCharacters,
    incorrectCharacters,
    correctWords,
    incorrectWords,
    backspaces,
    wpm,
    rawWpm,
    accuracy,
    errorRate,
    completionPercentage,
  };
}

export function calculateGrade(wpm: number, accuracy: number): PerformanceGrade {
  if (wpm >= 90 && accuracy >= 97) return "S";
  if (wpm >= 70 && accuracy >= 95) return "A";
  if (wpm >= 50 && accuracy >= 90) return "B";
  if (wpm >= 30 && accuracy >= 80) return "C";
  return "D";
}

export function buildResult(
  config: TypingTestConfig,
  stats: TypingStats,
  durationMs: number
): TypingTestResult {
  return {
    id: generateId(),
    timestamp: Date.now(),
    config,
    durationMs,
    wpm: stats.wpm,
    rawWpm: stats.rawWpm,
    accuracy: stats.accuracy,
    correctCharacters: stats.correctCharacters,
    incorrectCharacters: stats.incorrectCharacters,
    totalCharacters: stats.typedCharacters,
    errors: stats.incorrectCharacters,
    grade: calculateGrade(stats.wpm, stats.accuracy),
  };
}
