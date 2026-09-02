import { CheckCircle2, Circle, AlertTriangle, Timer } from "lucide-react";
import type { KeyboardDiagnostics } from "./keyboard-types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDuration } from "@/lib/utils";

interface DiagnosticsProps {
  diagnostics: KeyboardDiagnostics;
}

export function Diagnostics({ diagnostics }: DiagnosticsProps) {
  const { totalKeys, testedKeys, untestedKeys, workingKeys, problemKeys, testDurationMs } = diagnostics;

  const stats = [
    { icon: CheckCircle2, tone: "text-mint", label: "Working", value: workingKeys },
    { icon: Circle, tone: "text-muted", label: "Not Tested", value: untestedKeys },
    { icon: AlertTriangle, tone: "text-danger", label: "Attention Required", value: problemKeys },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnostics Summary</CardTitle>
        <div className="flex items-center gap-1.5 font-mono text-xs text-muted">
          <Timer size={13} aria-hidden="true" />
          {formatDuration(testDurationMs)}
        </div>
      </CardHeader>

      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, tone, label, value }) => (
          <div key={label} className="rounded-key border border-mist bg-surface-raised px-3 py-3 text-center">
            <Icon size={18} className={`mx-auto mb-1.5 ${tone}`} aria-hidden="true" />
            <div className="font-mono text-lg font-semibold text-paper">{value}</div>
            <div className="text-[11px] text-muted">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-muted">
        <span>
          {testedKeys} of {totalKeys} keys tested
        </span>
        <span>{totalKeys > 0 ? Math.round((testedKeys / totalKeys) * 100) : 0}% coverage</span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        A key marked <span className="text-danger">Attention Required</span> was not detected during
        this test — this can reflect the physical key, but it can also reflect browser or OS
        limitations for that key. It is not a definitive hardware diagnosis.
      </p>
    </Card>
  );
}
