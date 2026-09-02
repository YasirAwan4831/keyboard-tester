import type { KeyboardKey, KeyboardLayoutDefinition } from "@/types";

/**
 * Layouts are pure data. Adding AZERTY, QWERTZ, or a compact 60% layout
 * later means adding another `KeyboardLayoutDefinition`, not touching any
 * rendering code.
 */

const key = (
  code: string,
  label: string,
  type: KeyboardKey["type"],
  width = 1,
  extra: Partial<KeyboardKey> = {}
): KeyboardKey => ({ code, label, type, width, ...extra });

const functionRow: KeyboardKey[] = [
  key("Escape", "Esc", "function"),
  key("F1", "F1", "function"),
  key("F2", "F2", "function"),
  key("F3", "F3", "function"),
  key("F4", "F4", "function"),
  key("F5", "F5", "function"),
  key("F6", "F6", "function"),
  key("F7", "F7", "function"),
  key("F8", "F8", "function"),
  key("F9", "F9", "function"),
  key("F10", "F10", "function"),
  key("F11", "F11", "function"),
  key("F12", "F12", "function"),
  key("PrintScreen", "PrtSc", "system", 1, { unreliable: true }),
  key("ScrollLock", "ScrLk", "system", 1, { unreliable: true }),
  key("Pause", "Pause", "system", 1, { unreliable: true }),
];

const numberRowKeys: KeyboardKey[] = [
  key("Backquote", "`", "letter", 1, { secondaryLabel: "~" }),
  key("Digit1", "1", "number", 1, { secondaryLabel: "!" }),
  key("Digit2", "2", "number", 1, { secondaryLabel: "@" }),
  key("Digit3", "3", "number", 1, { secondaryLabel: "#" }),
  key("Digit4", "4", "number", 1, { secondaryLabel: "$" }),
  key("Digit5", "5", "number", 1, { secondaryLabel: "%" }),
  key("Digit6", "6", "number", 1, { secondaryLabel: "^" }),
  key("Digit7", "7", "number", 1, { secondaryLabel: "&" }),
  key("Digit8", "8", "number", 1, { secondaryLabel: "*" }),
  key("Digit9", "9", "number", 1, { secondaryLabel: "(" }),
  key("Digit0", "0", "number", 1, { secondaryLabel: ")" }),
  key("Minus", "-", "letter", 1, { secondaryLabel: "_" }),
  key("Equal", "=", "letter", 1, { secondaryLabel: "+" }),
  key("Backspace", "Backspace", "editing", 2),
];

const tabRow: KeyboardKey[] = [
  key("Tab", "Tab", "modifier", 1.5),
  key("KeyQ", "Q", "letter"),
  key("KeyW", "W", "letter"),
  key("KeyE", "E", "letter"),
  key("KeyR", "R", "letter"),
  key("KeyT", "T", "letter"),
  key("KeyY", "Y", "letter"),
  key("KeyU", "U", "letter"),
  key("KeyI", "I", "letter"),
  key("KeyO", "O", "letter"),
  key("KeyP", "P", "letter"),
  key("BracketLeft", "[", "letter", 1, { secondaryLabel: "{" }),
  key("BracketRight", "]", "letter", 1, { secondaryLabel: "}" }),
  key("Backslash", "\\", "letter", 1.5, { secondaryLabel: "|" }),
];

const homeRow: KeyboardKey[] = [
  key("CapsLock", "Caps Lock", "modifier", 1.75),
  key("KeyA", "A", "letter"),
  key("KeyS", "S", "letter"),
  key("KeyD", "D", "letter"),
  key("KeyF", "F", "letter"),
  key("KeyG", "G", "letter"),
  key("KeyH", "H", "letter"),
  key("KeyJ", "J", "letter"),
  key("KeyK", "K", "letter"),
  key("KeyL", "L", "letter"),
  key("Semicolon", ";", "letter", 1, { secondaryLabel: ":" }),
  key("Quote", "'", "letter", 1, { secondaryLabel: '"' }),
  key("Enter", "Enter", "modifier", 2.25),
];

const bottomLetterRow: KeyboardKey[] = [
  key("ShiftLeft", "Shift", "modifier", 2.25),
  key("KeyZ", "Z", "letter"),
  key("KeyX", "X", "letter"),
  key("KeyC", "C", "letter"),
  key("KeyV", "V", "letter"),
  key("KeyB", "B", "letter"),
  key("KeyN", "N", "letter"),
  key("KeyM", "M", "letter"),
  key("Comma", ",", "letter", 1, { secondaryLabel: "<" }),
  key("Period", ".", "letter", 1, { secondaryLabel: ">" }),
  key("Slash", "/", "letter", 1, { secondaryLabel: "?" }),
  key("ShiftRight", "Shift", "modifier", 2.75),
];

const spaceRow: KeyboardKey[] = [
  key("ControlLeft", "Ctrl", "modifier", 1.25),
  key("MetaLeft", "Win", "modifier", 1.25, { unreliable: true }),
  key("AltLeft", "Alt", "modifier", 1.25),
  key("Space", "", "whitespace", 6.25),
  key("AltRight", "Alt", "modifier", 1.25),
  key("MetaRight", "Win", "modifier", 1.25, { unreliable: true }),
  key("ContextMenu", "Menu", "modifier", 1.25, { unreliable: true }),
  key("ControlRight", "Ctrl", "modifier", 1.25),
];

const navCluster: KeyboardKey[][] = [
  [key("Insert", "Ins", "navigation"), key("Home", "Home", "navigation"), key("PageUp", "PgUp", "navigation")],
  [key("Delete", "Del", "editing"), key("End", "End", "navigation"), key("PageDown", "PgDn", "navigation")],
];

const arrowCluster: KeyboardKey[][] = [
  [key("ArrowUp", "↑", "arrow")],
  [key("ArrowLeft", "←", "arrow"), key("ArrowDown", "↓", "arrow"), key("ArrowRight", "→", "arrow")],
];

const numpadRows: KeyboardKey[][] = [
  [
    key("NumLock", "Num", "numpad"),
    key("NumpadDivide", "/", "numpad"),
    key("NumpadMultiply", "*", "numpad"),
    key("NumpadSubtract", "-", "numpad"),
  ],
  [
    key("Numpad7", "7", "numpad"),
    key("Numpad8", "8", "numpad"),
    key("Numpad9", "9", "numpad"),
    key("NumpadAdd", "+", "numpad"),
  ],
  [key("Numpad4", "4", "numpad"), key("Numpad5", "5", "numpad"), key("Numpad6", "6", "numpad")],
  [
    key("Numpad1", "1", "numpad"),
    key("Numpad2", "2", "numpad"),
    key("Numpad3", "3", "numpad"),
    key("NumpadEnter", "Enter", "numpad"),
  ],
  [key("Numpad0", "0", "numpad", 2), key("NumpadDecimal", ".", "numpad")],
];

export const US_QWERTY_LAYOUT: KeyboardLayoutDefinition = {
  id: "us-qwerty",
  name: "US QWERTY",
  rows: [functionRow, numberRowKeys, tabRow, homeRow, bottomLetterRow, spaceRow],
  navRows: [...navCluster, ...arrowCluster],
  numpadRows,
};

const LAYOUTS: Record<string, KeyboardLayoutDefinition> = {
  [US_QWERTY_LAYOUT.id]: US_QWERTY_LAYOUT,
};

export function getLayout(id: string = US_QWERTY_LAYOUT.id): KeyboardLayoutDefinition {
  return LAYOUTS[id] ?? US_QWERTY_LAYOUT;
}

export function getAllLayoutIds(): { id: string; name: string }[] {
  return Object.values(LAYOUTS).map(({ id, name }) => ({ id, name }));
}

/** Flat list of every key across the main rows, nav cluster, and numpad. */
export function getAllKeys(layout: KeyboardLayoutDefinition = US_QWERTY_LAYOUT): KeyboardKey[] {
  const rows = [...layout.rows, ...(layout.navRows ?? []), ...(layout.numpadRows ?? [])];
  return rows.flat();
}
