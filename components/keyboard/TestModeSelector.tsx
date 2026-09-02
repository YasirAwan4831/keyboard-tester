import type { KeyboardTestMode } from "./keyboard-types";
import { cn } from "@/lib/utils";

interface TestModeSelectorProps {
  mode: KeyboardTestMode;
  onChange: (mode: KeyboardTestMode) => void;
}

const MODES: { id: KeyboardTestMode; label: string; description: string }[] = [
  { id: "quick", label: "Quick Test", description: "Press freely, watch live stats" },
  { id: "guided", label: "Full Keyboard Test", description: "Step through every key in order" },
  { id: "manual", label: "Manual Test", description: "Press any key, inspect the result" },
];

export function TestModeSelector({ mode, onChange }: TestModeSelectorProps) {
  return (
    <div role="tablist" aria-label="Keyboard test mode" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          role="tab"
          aria-selected={mode === m.id}
          onClick={() => onChange(m.id)}
          className={cn(
            "keycap rounded-key border px-4 py-3 text-left transition-colors",
            mode === m.id
              ? "border-amber bg-amber-soft text-paper"
              : "border-mist bg-surface-raised text-muted hover:text-paper"
          )}
        >
          <div className="font-mono text-sm font-semibold">{m.label}</div>
          <div className="mt-0.5 text-xs text-muted">{m.description}</div>
        </button>
      ))}
    </div>
  );
}
