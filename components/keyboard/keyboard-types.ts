// Keyboard-specific types live in the shared `types/` module so the same
// shapes can be reused by lib/keyboard.ts, hooks, and the API layer. This
// file re-exports them so keyboard components can import everything they
// need from one relative location, matching the rest of the component
// folder's structure.
export type {
  KeyCategory,
  KeyboardKey,
  KeyboardRowDefinition,
  KeyboardLayoutDefinition,
  KeyStatus,
  KeyTestResult,
  KeyboardDiagnostics,
  KeyboardTestMode,
} from "@/types";
