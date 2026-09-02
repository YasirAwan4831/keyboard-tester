import type { Metadata } from "next";
import { TypingTest } from "@/components/typing/TypingTest";

export const metadata: Metadata = {
  title: "Typing Test",
  description: "Measure your typing speed, raw WPM, and accuracy with a timed browser-based typing test.",
};

export default function TypingTestPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 text-center">
        <h1 className="font-mono text-3xl font-bold text-paper sm:text-4xl">Typing Test</h1>
        <p className="mt-2 text-muted">Choose a duration and difficulty, then start typing.</p>
      </div>
      <TypingTest />
    </div>
  );
}
