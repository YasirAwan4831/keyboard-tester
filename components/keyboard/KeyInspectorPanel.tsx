import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { findKey } from "@/lib/keyboard";
import { US_QWERTY_LAYOUT } from "./KeyboardLayout";
import type { KeyTestResult } from "./keyboard-types";

interface KeyInspectorPanelProps {
  lastPressedCode: string | null;
  keyStates: Record<string, KeyTestResult>;
}

export function KeyInspectorPanel({ lastPressedCode, keyStates }: KeyInspectorPanelProps) {
  const keyDef = lastPressedCode ? findKey(lastPressedCode, US_QWERTY_LAYOUT) : undefined;
  const state = lastPressedCode ? keyStates[lastPressedCode] : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Inspector</CardTitle>
        {state?.status === "passed" && <Badge tone="mint">Detected</Badge>}
      </CardHeader>

      {!lastPressedCode || !keyDef || !state ? (
        <p className="py-4 text-center text-sm text-muted">
          Press any physical key to inspect it here.
        </p>
      ) : (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-sm">
          <div>
            <dt className="text-[11px] uppercase text-muted">Label</dt>
            <dd className="text-paper">{keyDef.label || "Space"}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase text-muted">event.code</dt>
            <dd className="text-paper">{keyDef.code}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase text-muted">Category</dt>
            <dd className="text-paper">{keyDef.type}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase text-muted">Press Count</dt>
            <dd className="text-paper">{state.pressCount}</dd>
          </div>
        </dl>
      )}
    </Card>
  );
}
