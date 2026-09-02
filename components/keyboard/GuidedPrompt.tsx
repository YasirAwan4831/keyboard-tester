import { SkipForward, AlertTriangle, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { findKey } from "@/lib/keyboard";
import { US_QWERTY_LAYOUT } from "./KeyboardLayout";

interface GuidedPromptProps {
  targetCode: string | null;
  currentIndex: number;
  totalKeys: number;
  isComplete: boolean;
  onSkip: () => void;
  onMarkFailed: () => void;
  onRestart: () => void;
}

export function GuidedPrompt({
  targetCode,
  currentIndex,
  totalKeys,
  isComplete,
  onSkip,
  onMarkFailed,
  onRestart,
}: GuidedPromptProps) {
  if (isComplete) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-mint bg-mint-soft px-6 py-8 text-center">
        <PartyPopper size={28} className="text-mint" aria-hidden="true" />
        <p className="font-mono text-lg font-semibold text-paper">Guided test complete</p>
        <p className="max-w-sm text-sm text-muted">
          Check the diagnostics summary below for a full breakdown of every key.
        </p>
        <Button variant="secondary" size="sm" onClick={onRestart}>
          Run it again
        </Button>
      </div>
    );
  }

  const keyDef = targetCode ? findKey(targetCode, US_QWERTY_LAYOUT) : undefined;
  const progress = totalKeys > 0 ? Math.round((currentIndex / totalKeys) * 100) : 0;

  return (
    <div className="rounded-lg border border-amber bg-amber-soft px-6 py-5">
      <div className="mb-3 flex items-center justify-between text-xs font-mono uppercase tracking-wide text-muted">
        <span>
          Key {Math.min(currentIndex + 1, totalKeys)} of {totalKeys}
        </span>
        <span>{progress}%</span>
      </div>
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
        <div
          className="h-full rounded-full bg-amber transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="font-mono text-xl font-semibold text-paper" aria-live="polite">
        Press the <span className="text-amber">{keyDef?.label || targetCode}</span> key
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={onSkip}>
          <SkipForward size={14} /> Skip this key
        </Button>
        <Button variant="ghost" size="sm" onClick={onMarkFailed}>
          <AlertTriangle size={14} /> Key not working
        </Button>
      </div>
    </div>
  );
}
