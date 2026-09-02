import { KeyboardRow } from "./KeyboardRow";
import { Key } from "./Key";
import type { KeyboardLayoutDefinition, KeyStatus } from "./keyboard-types";

interface KeyboardProps {
  layout: KeyboardLayoutDefinition;
  keyStates: Record<string, { status: KeyStatus }>;
  heldCodes: Set<string>;
  guidedTargetCode: string | null;
}

export function Keyboard({ layout, keyStates, heldCodes, guidedTargetCode }: KeyboardProps) {
  const [navRow1, navRow2, arrowRowUp, arrowRowBottom] = layout.navRows ?? [];
  const arrowUpKey = arrowRowUp?.[0];

  const rowProps = { keyStates, heldCodes, guidedTargetCode };

  return (
    <div className="scrollbar-thin overflow-x-auto pb-3">
      <div className="mx-auto flex min-w-[900px] max-w-[1100px] gap-4">
        {/* Main alphanumeric block */}
        <div className="flex flex-1 flex-col gap-1">
          {layout.rows.map((row, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <KeyboardRow key={index} row={row} {...rowProps} />
          ))}
        </div>

        {/* Navigation + arrow cluster */}
        <div className="flex w-[168px] flex-col gap-1">
          {navRow1 && <KeyboardRow row={navRow1} {...rowProps} />}
          {navRow2 && <KeyboardRow row={navRow2} {...rowProps} />}
          <div className="flex-1" />
          <div className="flex flex-col items-stretch gap-1">
            <div className="flex gap-1">
              <div className="flex-1" />
              {arrowUpKey && (
                <div className="flex-1">
                  <Key
                    keyDef={arrowUpKey}
                    status={keyStates[arrowUpKey.code]?.status ?? "untested"}
                    isHeld={heldCodes.has(arrowUpKey.code)}
                    isGuidedTarget={guidedTargetCode === arrowUpKey.code}
                  />
                </div>
              )}
              <div className="flex-1" />
            </div>
            {arrowRowBottom && <KeyboardRow row={arrowRowBottom} {...rowProps} />}
          </div>
        </div>

        {/* Numeric keypad */}
        {layout.numpadRows && (
          <div className="flex w-[168px] flex-col gap-1">
            {layout.numpadRows.map((row, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <KeyboardRow key={index} row={row} {...rowProps} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
