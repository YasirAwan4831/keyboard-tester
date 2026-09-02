import { RotateCcw, Play } from "lucide-react";
import type { TypingContentMode, TypingDifficulty, TypingDuration, TypingTestConfig } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface TypingControlsProps {
  config: TypingTestConfig;
  status: "idle" | "running" | "finished";
  onConfigChange: (partial: Partial<TypingTestConfig>) => void;
  onStart: () => void;
  onRestart: () => void;
}

const DURATIONS: TypingDuration[] = [15, 30, 60, 120];
const DIFFICULTIES: TypingDifficulty[] = ["easy", "medium", "hard"];
const CONTENT_MODES: { id: TypingContentMode; label: string }[] = [
  { id: "words", label: "Words" },
  { id: "sentences", label: "Sentences" },
  { id: "paragraph", label: "Paragraph" },
];

function ToggleGroup<T extends string | number>({
  options,
  value,
  onChange,
  disabled,
  formatLabel,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  disabled: boolean;
  formatLabel: (v: T) => string;
}) {
  return (
    <div className="flex gap-1 rounded-key border border-mist bg-surface-raised p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={cn(
            "rounded px-2.5 py-1.5 font-mono text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            value === option ? "bg-amber text-ink" : "text-muted hover:text-paper"
          )}
        >
          {formatLabel(option)}
        </button>
      ))}
    </div>
  );
}

export function TypingControls({ config, status, onConfigChange, onStart, onRestart }: TypingControlsProps) {
  const disabled = status !== "idle";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-3">
        <ToggleGroup
          options={DURATIONS}
          value={config.duration}
          disabled={disabled}
          onChange={(v) => onConfigChange({ duration: v })}
          formatLabel={(v) => `${v}s`}
        />
        <ToggleGroup
          options={DIFFICULTIES}
          value={config.difficulty}
          disabled={disabled}
          onChange={(v) => onConfigChange({ difficulty: v })}
          formatLabel={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
        />
        <ToggleGroup
          options={CONTENT_MODES.map((c) => c.id)}
          value={config.contentMode}
          disabled={disabled}
          onChange={(v) => onConfigChange({ contentMode: v })}
          formatLabel={(v) => CONTENT_MODES.find((c) => c.id === v)?.label ?? v}
        />
      </div>

      {status === "idle" && (
        <Button onClick={onStart}>
          <Play size={16} /> Start Test
        </Button>
      )}
      {status !== "idle" && (
        <Button variant="secondary" onClick={onRestart}>
          <RotateCcw size={16} /> Restart
        </Button>
      )}
    </div>
  );
}
