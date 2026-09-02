import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        mist: "var(--color-mist)",
        paper: "var(--color-paper)",
        muted: "var(--color-muted)",
        amber: {
          DEFAULT: "var(--color-amber)",
          soft: "var(--color-amber-soft)",
        },
        mint: {
          DEFAULT: "var(--color-mint)",
          soft: "var(--color-mint-soft)",
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          soft: "var(--color-danger-soft)",
        },
        info: "var(--color-info)",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        key: "6px",
      },
      keyframes: {
        "key-press": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(2px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 var(--color-amber-soft)" },
          "100%": { boxShadow: "0 0 0 8px transparent" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "key-press": "key-press 80ms ease-out forwards",
        "fade-up": "fade-up 300ms ease-out forwards",
        "pulse-ring": "pulse-ring 900ms ease-out infinite",
        blink: "blink 1s step-start infinite",
      },
    },
  },
  plugins: [],
};

export default config;
