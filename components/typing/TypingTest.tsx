"use client";

import { useRef, useState } from "react";
import { MousePointerClick } from "lucide-react";
import { useTypingTest } from "@/hooks/useTypingTest";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TypingControls } from "./TypingControls";
import { TypingStats } from "./TypingStats";
import { TypingText } from "./TypingText";
import { TypingResults } from "./TypingResults";

export function TypingTest() {
  const { addResult } = useLocalStorage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const { config, updateConfig, status, targetText, typedText, stats, result, start, restart, handleKeyDown, remainingMs } =
    useTypingTest({ onFinish: addResult });

  function focusInput() {
    inputRef.current?.focus();
  }

  if (status === "finished" && result) {
    return (
      <TypingResults
        result={result}
        onTryAgain={() => {
          restart();
          start();
          requestAnimationFrame(focusInput);
        }}
        onChangeSettings={restart}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <TypingControls
        config={config}
        status={status}
        onConfigChange={updateConfig}
        onStart={() => {
          start();
          requestAnimationFrame(focusInput);
        }}
        onRestart={restart}
      />

      <TypingStats stats={stats} remainingMs={remainingMs} />

      <div
        onClick={focusInput}
        className="relative cursor-text rounded-lg outline-none"
      >
        <TypingText targetText={targetText} typedText={typedText} />

        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Typing test input — type the displayed text"
          className="absolute h-px w-px opacity-0"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
        />

        {!isFocused && status !== "finished" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-[color:var(--color-overlay)] backdrop-blur-[2px]">
            <span className="flex items-center gap-2 rounded-key border border-mist bg-surface px-4 py-2 font-mono text-sm text-paper">
              <MousePointerClick size={16} className="text-amber" /> Click here, then start typing
            </span>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted">
        Standard calculation: 5 characters = 1 word. WPM uses correctly typed characters; Raw WPM
        counts every keystroke, mistakes included.
      </p>
    </div>
  );
}
