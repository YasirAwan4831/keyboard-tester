import Link from "next/link";
import { ArrowRight, Gauge, ShieldCheck, Sparkles, KeyRound } from "lucide-react";
import { KeyboardTester } from "@/components/keyboard/KeyboardTester";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: KeyRound,
    title: "Every key, tested",
    body: "A full virtual keyboard tracks every physical key press with KeyboardEvent.code, so it identifies position — not just character.",
  },
  {
    icon: Gauge,
    title: "Real typing metrics",
    body: "WPM, raw WPM, accuracy, and error rate — calculated with the standard 5-characters-per-word convention and timestamp-accurate timing.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Keyboard testing and typing calculations happen in your browser. Your history is stored locally — no account, no mandatory database.",
  },
  {
    icon: Sparkles,
    title: "Built for daily use",
    body: "Three test modes, guided key-by-key diagnostics, and a personal stats dashboard that tracks your progress over time.",
  },
];

const FAQS = [
  {
    q: "Can this tell me for certain that a key is broken?",
    a: "No. A browser can only report the key presses it receives. If a key doesn't register, that's meaningful evidence — but hardware, OS, and browser quirks can all cause a missed event, so we describe it as \"not detected during this test,\" not a hardware diagnosis.",
  },
  {
    q: "Does my typing data get sent anywhere?",
    a: "Keyboard testing and typing calculations run entirely in your browser. Local history is stored with localStorage on your device. See the Privacy page for full details.",
  },
  {
    q: "What counts as a \"word\" for WPM?",
    a: "The typing-test standard: 5 characters, including spaces, equal one word. This keeps results comparable regardless of the actual words typed.",
  },
  {
    q: "Does this work on mobile?",
    a: "The typing test works with any input method. Physical keyboard testing needs an actual hardware keyboard, so it's most useful on a desktop or laptop, or a mobile device with one connected.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Hero */}
      <section className="mb-14 flex flex-col items-center text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-mist bg-surface-raised px-3 py-1 font-mono text-xs text-muted">
          No sign-up · Runs in your browser
        </span>
        <h1 className="max-w-3xl font-mono text-4xl font-bold leading-tight text-paper sm:text-5xl md:text-6xl">
          Test Your Keyboard.
          <br />
          Measure Your Speed.
        </h1>
        <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">
          Check every key, diagnose keyboard input, and measure your typing performance — all in
          your browser.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="#keyboard-tester">
            <Button size="lg">
              Test My Keyboard <ArrowRight size={16} />
            </Button>
          </a>
          <Link href="/typing-test">
            <Button variant="secondary" size="lg">
              Start Typing Test
            </Button>
          </Link>
        </div>
      </section>

      {/* Keyboard tester */}
      <section id="keyboard-tester" className="mb-16 scroll-mt-20">
        <KeyboardTester />
      </section>

      {/* Feature cards */}
      <section className="mb-16">
        <h2 className="mb-6 text-center font-mono text-2xl font-bold text-paper">
          Everything you need, nothing you don&apos;t
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <f.icon size={20} className="mb-3 text-amber" aria-hidden="true" />
              <h3 className="mb-1.5 font-mono text-sm font-semibold text-paper">{f.title}</h3>
              <p className="text-sm text-muted">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="mb-6 text-center font-mono text-2xl font-bold text-paper">How it works</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { step: "01", title: "Press keys", body: "Use the keyboard tester above and press any physical key — watch the matching virtual key light up." },
            { step: "02", title: "Measure speed", body: "Head to the Typing Test to measure WPM, raw WPM, and accuracy across a timed passage." },
            { step: "03", title: "Track progress", body: "Every result is saved locally, so your Statistics dashboard builds a picture of your progress over time." },
          ].map((item) => (
            <Card key={item.step}>
              <div className="mb-2 font-mono text-xs text-amber">{item.step}</div>
              <h3 className="mb-1.5 font-mono text-sm font-semibold text-paper">{item.title}</h3>
              <p className="text-sm text-muted">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-4">
        <h2 className="mb-6 text-center font-mono text-2xl font-bold text-paper">
          Frequently asked questions
        </h2>
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {FAQS.map((item) => (
            <Card key={item.q}>
              <h3 className="mb-1.5 font-mono text-sm font-semibold text-paper">{item.q}</h3>
              <p className="text-sm text-muted">{item.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
