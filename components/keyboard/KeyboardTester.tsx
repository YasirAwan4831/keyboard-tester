"use client";

import { RotateCcw } from "lucide-react";
import { useKeyboard } from "@/hooks/useKeyboard";
import { Keyboard } from "./Keyboard";
import { TestModeSelector } from "./TestModeSelector";
import { GuidedPrompt } from "./GuidedPrompt";
import { Diagnostics } from "./Diagnostics";
import { QuickStatsPanel } from "./QuickStatsPanel";
import { KeyInspectorPanel } from "./KeyInspectorPanel";
import { Button } from "@/components/ui/Button";

export function KeyboardTester() {
  const {
    layout,
    keyStates,
    pressedCodes,
    lastPressedCode,
    mode,
    setMode,
    guidedIndex,
    guidedSequence,
    guidedTargetCode,
    isGuidedComplete,
    skipGuidedKey,
    markGuidedKeyFailed,
    diagnostics,
    reset,
  } = useKeyboard();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <TestModeSelector mode={mode} onChange={setMode} />
        <Button variant="secondary" size="sm" onClick={reset} className="shrink-0">
          <RotateCcw size={14} /> Reset test
        </Button>
      </div>

      {mode === "guided" && (
        <GuidedPrompt
          targetCode={guidedTargetCode}
          currentIndex={guidedIndex}
          totalKeys={guidedSequence.length}
          isComplete={isGuidedComplete}
          onSkip={skipGuidedKey}
          onMarkFailed={markGuidedKeyFailed}
          onRestart={reset}
        />
      )}

      {mode === "quick" && (
        <QuickStatsPanel diagnostics={diagnostics} lastPressedCode={lastPressedCode} keyStates={keyStates} />
      )}

      {mode === "manual" && (
        <KeyInspectorPanel lastPressedCode={lastPressedCode} keyStates={keyStates} />
      )}

      <div className="rounded-lg border border-mist bg-surface p-4 sm:p-6">
        <Keyboard
          layout={layout}
          keyStates={keyStates}
          heldCodes={pressedCodes}
          guidedTargetCode={mode === "guided" ? guidedTargetCode : null}
        />
      </div>

      <Diagnostics diagnostics={diagnostics} />

      <p className="text-center text-xs text-muted sm:hidden">
        Keyboard testing works best with a physical keyboard connected to this device.
      </p>
    </div>
  );
}
