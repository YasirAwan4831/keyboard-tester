import type { Metadata } from "next";
import { Card, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About",
  description: "How Keyboard Tester detects key presses, calculates typing speed, and handles your data.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-2 font-mono text-3xl font-bold text-paper sm:text-4xl">About Keyboard Tester</h1>
      <p className="mb-10 text-muted">What this tool does, how it works, and where it falls short.</p>

      <div className="flex flex-col gap-8">
        <section>
          <CardTitle className="mb-2">What it does</CardTitle>
          <p className="text-sm leading-relaxed text-paper">
            Keyboard Tester combines a physical keyboard diagnostic tool with a typing speed test.
            The keyboard tester shows you a virtual keyboard that lights up as you press physical
            keys, so you can quickly confirm which keys are registering and which aren&apos;t. The
            typing test measures how fast and how accurately you type against a timed passage of
            text.
          </p>
        </section>

        <section>
          <CardTitle className="mb-2">How keyboard detection works</CardTitle>
          <p className="text-sm leading-relaxed text-paper">
            Every key press fires a browser <code className="text-amber">KeyboardEvent</code>. That
            event carries two different pieces of information: <code className="text-amber">event.code</code>,
            which identifies the physical key on the keyboard regardless of layout or language, and{" "}
            <code className="text-amber">event.key</code>, which reflects the character that key
            currently produces. Keyboard Tester uses <code className="text-amber">event.code</code>{" "}
            to identify which physical key was pressed, and avoids the deprecated{" "}
            <code className="text-amber">event.keyCode</code> property entirely.
          </p>
        </section>

        <section>
          <CardTitle className="mb-2">How typing speed is calculated</CardTitle>
          <p className="text-sm leading-relaxed text-paper">
            Words per minute follows the standard typing-test convention: every five characters
            (including spaces) counts as one word. <strong className="text-paper">WPM</strong> is
            calculated from correctly typed characters only, while{" "}
            <strong className="text-paper">Raw WPM</strong> counts every character you typed,
            mistakes included. Timing is measured from real timestamps rather than a counter, so it
            stays accurate even if your browser tab is briefly throttled.
          </p>
        </section>

        <section>
          <CardTitle className="mb-2">What accuracy means</CardTitle>
          <p className="text-sm leading-relaxed text-paper">
            Accuracy is the percentage of typed characters that matched the target text at the same
            position: correct characters divided by total typed characters. It is not a measure of
            completion — a short, perfectly typed passage and a long one with a few mistakes can
            report very different accuracy despite similar effort.
          </p>
        </section>

        <section>
          <CardTitle className="mb-2">Browser limitations</CardTitle>
          <p className="text-sm leading-relaxed text-paper">
            Keyboard event behavior isn&apos;t perfectly uniform across browsers, operating systems,
            and hardware. Some keys — PrintScreen, ScrollLock, Pause, and certain media or modifier
            keys — are known to be reported inconsistently. Touch-only devices and virtual/on-screen
            keyboards may not fire the same events as a physical keyboard at all. Because of this,
            Keyboard Tester never claims a key is definitively broken — only that it{" "}
            <em>wasn&apos;t detected during this test</em>.
          </p>
        </section>

        <Card>
          <CardTitle className="mb-2">Privacy approach</CardTitle>
          <p className="text-sm leading-relaxed text-paper">
            Keyboard testing and typing calculations run entirely client-side, in your browser.
            Nothing about your keystrokes needs to reach a server for the core features to work.
            See the{" "}
            <a href="/privacy" className="text-amber underline underline-offset-2">
              Privacy page
            </a>{" "}
            for the full, honest picture — including what the optional API routes do.
          </p>
        </Card>
      </div>
    </div>
  );
}
