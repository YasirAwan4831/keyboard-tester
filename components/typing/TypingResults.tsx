import Link from "next/link";
import { RotateCcw, SlidersHorizontal, Keyboard as KeyboardIcon } from "lucide-react";
import type { TypingTestResult } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDuration } from "@/lib/utils";

interface TypingResultsProps {
  result: TypingTestResult;
  onTryAgain: () => void;
  onChangeSettings: () => void;
}

const GRADE_TONE: Record<TypingTestResult["grade"], "mint" | "amber" | "info" | "danger" | "neutral"> = {
  S: "mint",
  A: "mint",
  B: "amber",
  C: "info",
  D: "danger",
};

export function TypingResults({ result, onTryAgain, onChangeSettings }: TypingResultsProps) {
  const rows = [
    { label: "Final WPM", value: result.wpm },
    { label: "Raw WPM", value: result.rawWpm },
    { label: "Accuracy", value: `${result.accuracy}%` },
    { label: "Errors", value: result.errors },
    { label: "Correct Characters", value: result.correctCharacters },
    { label: "Incorrect Characters", value: result.incorrectCharacters },
    { label: "Total Characters", value: result.totalCharacters },
    { label: "Duration", value: formatDuration(result.durationMs) },
  ];

  return (
    <div className="animate-fade-up rounded-lg border border-mist bg-surface p-6 sm:p-8">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Badge tone={GRADE_TONE[result.grade]} className="px-3 py-1.5 text-sm">
          Grade {result.grade}
        </Badge>
        <div className="font-mono text-5xl font-bold text-paper sm:text-6xl">{result.wpm}</div>
        <div className="font-mono text-xs uppercase tracking-wider text-muted">Words Per Minute</div>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-mist pt-6 sm:grid-cols-4">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-[11px] uppercase tracking-wide text-muted">{row.label}</dt>
            <dd className="font-mono text-lg font-semibold text-paper">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button onClick={onTryAgain}>
          <RotateCcw size={16} /> Try Again
        </Button>
        <Button variant="secondary" onClick={onChangeSettings}>
          <SlidersHorizontal size={16} /> Change Settings
        </Button>
        <Link href="/">
          <Button variant="ghost">
            <KeyboardIcon size={16} /> Back to Keyboard Tester
          </Button>
        </Link>
      </div>
    </div>
  );
}
