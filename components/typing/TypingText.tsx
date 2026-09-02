"use client";

import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface TypingTextProps {
  targetText: string;
  typedText: string;
}

// Rendering only a window around the cursor (instead of the full ~3500
// character generated text) keeps this responsive even during very fast,
// sustained typing — a fixed, small number of DOM nodes per keystroke
// rather than one per character in the whole test.
const CHARS_BEHIND = 60;
const CHARS_AHEAD = 320;

export function TypingText({ targetText, typedText }: TypingTextProps) {
  const cursorRef = useRef<HTMLSpanElement>(null);

  const { slice, startIndex } = useMemo(() => {
    const start = Math.max(0, typedText.length - CHARS_BEHIND);
    const end = Math.min(targetText.length, typedText.length + CHARS_AHEAD);
    return { slice: targetText.slice(start, end), startIndex: start };
  }, [targetText, typedText.length]);

  useEffect(() => {
    cursorRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [typedText.length]);

  return (
    <div
      className="scrollbar-thin max-h-[7.5rem] overflow-y-auto rounded-lg border border-mist bg-surface-raised p-4 font-mono text-lg leading-8 tracking-wide sm:text-xl"
      aria-hidden="true"
    >
      {slice.split("").map((char, i) => {
        const absoluteIndex = startIndex + i;
        const isCurrent = absoluteIndex === typedText.length;
        const wasTyped = absoluteIndex < typedText.length;
        const isCorrect = wasTyped && typedText[absoluteIndex] === char;
        const isIncorrect = wasTyped && typedText[absoluteIndex] !== char;

        return (
          <span
            key={absoluteIndex}
            ref={isCurrent ? cursorRef : undefined}
            className={cn(
              "relative",
              isCorrect && "text-mint",
              isIncorrect && "rounded-sm bg-danger-soft text-danger",
              !wasTyped && !isCurrent && "text-muted",
              isCurrent && "text-paper"
            )}
          >
            {isCurrent && (
              <span
                className="absolute -left-px top-0 h-full w-0.5 animate-blink bg-amber"
                aria-hidden="true"
              />
            )}
            {char === " " && isIncorrect ? "\u00B7" : char}
          </span>
        );
      })}
    </div>
  );
}
