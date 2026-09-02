import { Check, X } from "lucide-react";
import type { KeyboardKey, KeyStatus } from "./keyboard-types";
import { cn } from "@/lib/utils";

interface KeyProps {
  keyDef: KeyboardKey;
  status: KeyStatus;
  isHeld: boolean;
  isGuidedTarget: boolean;
}

const STATUS_CLASSES: Record<KeyStatus, string> = {
  untested: "border-mist bg-surface-raised text-paper",
  pressed: "border-mist bg-surface-raised text-paper",
  passed: "border-mint bg-surface-raised text-paper",
  failed: "border-danger bg-danger-soft text-paper",
};

export function Key({ keyDef, status, isHeld, isGuidedTarget }: KeyProps) {
  const isSpace = keyDef.code === "Space";

  return (
    <div
      style={{ flexGrow: keyDef.width ?? 1, flexBasis: 0 }}
      className="min-w-0"
      data-testid={`key-${keyDef.code}`}
    >
      <div
        data-pressed={isHeld}
        className={cn(
          "keycap relative flex h-11 select-none flex-col items-center justify-center rounded-key border px-1 font-mono text-[11px] leading-none",
          STATUS_CLASSES[status],
          isHeld && "border-amber bg-amber-soft",
          isGuidedTarget && !isHeld && "animate-pulse-ring border-amber"
        )}
        aria-hidden="true"
      >
        {keyDef.secondaryLabel && (
          <span className="mb-0.5 text-[9px] text-muted">{keyDef.secondaryLabel}</span>
        )}
        {!isSpace && <span className="truncate px-0.5">{keyDef.label}</span>}

        {status === "passed" && (
          <Check size={10} className="absolute right-1 top-1 text-mint" aria-hidden="true" />
        )}
        {status === "failed" && (
          <X size={10} className="absolute right-1 top-1 text-danger" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
