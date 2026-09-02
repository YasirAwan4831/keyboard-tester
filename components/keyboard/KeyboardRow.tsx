import { Key } from "./Key";
import type { KeyboardRowDefinition, KeyStatus } from "./keyboard-types";

interface KeyboardRowProps {
  row: KeyboardRowDefinition;
  keyStates: Record<string, { status: KeyStatus }>;
  heldCodes: Set<string>;
  guidedTargetCode: string | null;
}

export function KeyboardRow({ row, keyStates, heldCodes, guidedTargetCode }: KeyboardRowProps) {
  return (
    <div className="flex gap-1">
      {row.map((keyDef) => (
        <Key
          key={keyDef.code}
          keyDef={keyDef}
          status={keyStates[keyDef.code]?.status ?? "untested"}
          isHeld={heldCodes.has(keyDef.code)}
          isGuidedTarget={guidedTargetCode === keyDef.code}
        />
      ))}
    </div>
  );
}
