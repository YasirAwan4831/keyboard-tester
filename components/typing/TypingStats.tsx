import type { TypingStats as TypingStatsType } from "@/types";
import { formatDuration } from "@/lib/utils";

interface TypingStatsProps {
  stats: TypingStatsType;
  remainingMs: number;
}

export function TypingStats({ stats, remainingMs }: TypingStatsProps) {
  const items = [
    { label: "WPM", value: stats.wpm, accent: true },
    { label: "Accuracy", value: `${stats.accuracy}%` },
    { label: "Time Left", value: formatDuration(remainingMs) },
    { label: "Errors", value: stats.incorrectCharacters },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-mist bg-surface-raised px-2 py-3 text-center sm:px-4 sm:py-4"
        >
          <div
            className={`font-mono text-2xl font-bold sm:text-4xl ${item.accent ? "text-amber" : "text-paper"}`}
          >
            {item.value}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted sm:text-xs">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
