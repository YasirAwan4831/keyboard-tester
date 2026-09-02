# Keyboard Tester

**Test Your Keyboard. Measure Your Speed.**

A professional, full-stack web application for testing physical keyboard keys and measuring typing speed — built with Next.js, React, and TypeScript. It runs entirely in the browser for its core features, requires no account, and has no mandatory database.

---

## Description

Keyboard Tester combines two tools developers and everyday users actually need:

1. **A keyboard tester** — a virtual keyboard that lights up in real time as you press physical keys, with Quick, Full Keyboard (guided), and Manual test modes, plus a diagnostics summary.
2. **A typing speed test** — a timed typing test that measures WPM, raw WPM, accuracy, and error rate, with configurable duration, difficulty, and content mode.

Every result is stored locally in your browser. Nothing about your keystrokes needs to reach a server for the app to work.

---

## Features

- **Full virtual keyboard** — function row, number row, QWERTY block, modifiers, navigation cluster, arrow keys, and numeric keypad, all data-driven from a single layout definition.
- **Three keyboard test modes** — Quick Test (free-form, live stats), Full Keyboard Test (guided, one key at a time, with skip/fail), and Manual Test (a detailed inspector for the last key pressed).
- **Honest diagnostics** — working / not-tested / attention-required counts, with careful language about what a browser can and can't determine about hardware.
- **Typing test engine** — 15/30/60/120 second durations, easy/medium/hard difficulty, and words/sentences/paragraph content modes.
- **Accurate, documented metrics** — WPM, Raw WPM, accuracy, error rate, and completion percentage, computed from real timestamps (not a drifting counter) and safe against `NaN`/`Infinity`.
- **Local statistics dashboard** — best/average WPM and accuracy, total tests, a lightweight trend chart, and a full history table with a clear-history option.
- **Local-only "leaderboard"** — the project is explicit that there is no global leaderboard, rather than faking one.
- **Dark and light themes** — a full, considered design system in both, not a single-color inversion.
- **Accessible by default** — semantic HTML, visible focus states, keyboard-operable controls, and `prefers-reduced-motion` support. The virtual keyboard is a visualization; every feature works from a real keyboard without it.
- **Responsive** — works from small phones to large desktops; the virtual keyboard scrolls horizontally on narrow screens instead of becoming illegible.
- **SEO-ready** — metadata, Open Graph/Twitter cards (generated locally, no external image URLs), `robots.txt`, and `sitemap.xml`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| UI | React 18 |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| Validation | Zod |
| Fonts | JetBrains Mono + Inter, self-hosted via `@fontsource` |
| Testing | Vitest |
| Persistence | Browser `localStorage` (no database) |

---

## Architecture

**Frontend** — React Server and Client Components under `app/`, composed from reusable pieces in `components/`. Pages are Server Components by default; anything that touches the keyboard, timers, or `localStorage` is explicitly a Client Component (`"use client"`).

**Backend** — Next.js Route Handlers under `app/api/`. There is no separate Express server; Next.js *is* the backend. The API routes exist for real, limited purposes (health check, result-payload validation, an honest "no leaderboard" response) — not to claim the project is full-stack without substance.

**Local persistence** — `lib/storage.ts` is the only module that touches `window.localStorage`. It handles SSR (returns empty data on the server), corrupted JSON, and missing storage, and every other part of the app goes through `hooks/useLocalStorage.ts` rather than calling it directly.

**Browser APIs** — Keyboard detection uses the native `KeyboardEvent` API (see below). Timing uses `Date.now()` timestamps and `requestAnimationFrame`, not `setInterval` counters, so results stay accurate under tab throttling.

---

## Keyboard Detection

Every key press fires a `KeyboardEvent` with two distinct pieces of information:

- **`event.code`** — identifies the *physical* key by position (e.g. `KeyQ`, `Digit1`, `ShiftLeft`), independent of the current layout, language, or modifier state.
- **`event.key`** — reflects the *character* that key currently produces (e.g. `"q"`, `"Q"`, `"1"`, `"!"`), which changes with Shift, Caps Lock, or a different keyboard layout.

Keyboard Tester uses `event.code` to identify which physical key was pressed (the keyboard tester's entire job), and `event.key` only where the typed character actually matters (the typing test). It never uses the deprecated `event.keyCode`.

**Browser limitations, stated plainly:** keyboard event behavior isn't perfectly uniform across browsers, operating systems, and hardware. `PrintScreen`, `ScrollLock`, `Pause`, and some modifier/media keys are known to be reported inconsistently, and touch-only devices may not fire physical key events at all. Because of this, a key that doesn't register is reported as **"not detected during this test"** — never as a definitive claim that the hardware is broken.

---

## Typing Calculations

- **WPM** = correctly-typed characters ÷ 5 ÷ elapsed minutes. This is the standard "5 characters = 1 word" convention, applied to characters typed correctly.
- **Raw WPM** = total typed characters (including mistakes) ÷ 5 ÷ elapsed minutes.
- **Accuracy** = correct characters ÷ total typed characters × 100. Reported as 100% before any input, rather than an undefined or misleading value.
- **Errors** = incorrect characters at the moment of completion.
- All statistics are computed defensively (`lib/utils.ts#safeDivide` / `roundSafe`) so a zero-duration or zero-input edge case can never render `NaN` or `Infinity` in the UI.

See the in-app **About** page for the same explanation in context.

---

## Project Structure

```text
keyboard-tester/
├── app/                  # Routes, layouts, API handlers (Next.js App Router)
│   ├── api/              # health, results, leaderboard route handlers
│   ├── typing-test/      # Typing Test page
│   ├── stats/            # Statistics dashboard page
│   ├── about/            # About / How It Works page
│   └── privacy/          # Privacy page
├── components/
│   ├── keyboard/         # Virtual keyboard, layout data, test modes, diagnostics
│   ├── typing/           # Typing test engine UI
│   ├── stats/            # Dashboard cards, history table, trend chart
│   ├── layout/           # Header, footer, mobile menu
│   ├── theme/            # Dark/light theme provider + toggle
│   └── ui/               # Button, Card, Badge, Modal primitives
├── hooks/                # useKeyboard, useTypingTest, useTimer, useLocalStorage
├── lib/                  # Pure logic: keyboard.ts, typing.ts, storage.ts, validation.ts, utils.ts
├── types/                # Shared TypeScript types
└── tests/                # Vitest unit tests for lib/ logic
```

---

## Installation

```bash
git clone <repository-url>
cd keyboard-tester
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Environment Variables

**None are currently required.** See `.env.example` — it's intentionally minimal because every core feature runs client-side or through stateless API routes with no external service dependency.

## Production Build

```bash
npm run build
npm run start
```

## Testing

```bash
npm run test        # run once
npm run test:watch  # watch mode
```

Tests cover the pure logic in `lib/`: typing statistics (WPM, raw WPM, accuracy, grading, zero-input safety), keyboard key-state transitions and diagnostics, `localStorage` persistence (including corrupted-data recovery), and shared utilities.

## Linting

```bash
npm run lint
```

## Deployment

Deploy to [Vercel](https://vercel.com) (or any Node-compatible host):

1. Push this repository to GitHub.
2. Import it in Vercel — no configuration or environment variables are required.
3. Vercel will detect Next.js automatically and deploy `npm run build` / `npm run start`.

Since there's no mandatory database, there's nothing else to provision.

---

## Limitations

- **Keyboard detection depends on the browser and OS.** A handful of keys (`PrintScreen`, `ScrollLock`, `Pause`, some `Meta`/media keys) are known to be reported inconsistently across platforms and are excluded from the guided test sequence for that reason.
- **Touch-only devices can't physically test a hardware keyboard.** The typing test still works with any input method; the keyboard tester is most meaningful with a real keyboard attached.
- **The "leaderboard" is local only.** There is no server-side database in this project, so there is no global leaderboard — `/api/leaderboard` says so directly instead of returning fabricated data.
- **`localStorage` is per-browser, per-device.** Clearing browser data, using a different browser, or private/incognito mode will not show previous history.

## Future Improvements

- Additional keyboard layouts (AZERTY, QWERTZ, compact/60%) — the layout system in `components/keyboard/KeyboardLayout.ts` is already data-driven to support this.
- Optional user accounts with cloud sync, as a genuinely additive feature rather than a requirement.
- A real, opt-in global leaderboard backed by serverless-compatible storage.
- Deeper analytics (per-finger heatmaps, common mistyped character pairs).
- Multiplayer typing competitions.
- Installable PWA support for offline use.

## License

[MIT](./LICENSE)
