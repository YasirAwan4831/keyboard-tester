import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDuration } from "@/lib/utils";
import type { KeyboardDiagnostics, KeyTestResult } from "./keyboard-types";

interface QuickStatsPanelProps {
  diagnostics: KeyboardDiagnostics;
  lastPressedCode: string | null;
  keyStates: Record<string, KeyTestResult>;
}

export function QuickStatsPanel({ diagnostics, lastPressedCode, keyStates }: QuickStatsPanelProps) {
  const totalPresses = Object.values(keyStates).reduce((sum, k) => sum + k.pressCount, 0);

  const stats = [
    { label: "Keys Tested", value: diagnostics.testedKeys },
    { label: "Last Key", value: lastPressedCode ?? "—" },
    { label: "Key Presses", value: totalPresses },
    { label: "Duration", value: formatDuration(diagnostics.testDurationMs) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Test</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-key border border-mist bg-surface-raised px-3 py-3">
            <div className="truncate font-mono text-lg font-semibold text-paper">{s.value}</div>
            <div className="text-[11px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        Press any key on your physical keyboard — the matching virtual key lights up below.
      </p>
    </Card>
  );
}
