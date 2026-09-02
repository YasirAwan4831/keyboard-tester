import type { Metadata } from "next";
import { CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Privacy",
  description: "An honest, plain-language explanation of what Keyboard Tester does and doesn't do with your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-2 font-mono text-3xl font-bold text-paper sm:text-4xl">Privacy</h1>
      <p className="mb-10 text-muted">Plain-language, and honest about what actually happens.</p>

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-paper">
        <section>
          <CardTitle className="mb-2">No account required</CardTitle>
          <p>
            Keyboard Tester doesn&apos;t have accounts, logins, or user profiles. You can use every
            feature immediately, with nothing to sign up for.
          </p>
        </section>

        <section>
          <CardTitle className="mb-2">No mandatory database</CardTitle>
          <p>
            This application does not require a database to function. It runs as a self-contained
            Next.js app that can be deployed without provisioning any external data store.
          </p>
        </section>

        <section>
          <CardTitle className="mb-2">Where your typing history lives</CardTitle>
          <p>
            Your test results and statistics are saved with <code className="text-amber">localStorage</code>{" "}
            in your own browser, on your own device. They are never transmitted anywhere as part of
            normal use of the Statistics page, and clearing your browser data or using the
            in-app &quot;Clear history&quot; option removes them completely.
          </p>
        </section>

        <section>
          <CardTitle className="mb-2">Keyboard testing happens client-side</CardTitle>
          <p>
            Detecting key presses and rendering the virtual keyboard all happens directly in your
            browser using standard <code className="text-amber">KeyboardEvent</code> APIs. Raw
            keystrokes are never logged or sent to a server.
          </p>
        </section>

        <section>
          <CardTitle className="mb-2">What the API routes actually do</CardTitle>
          <p className="mb-2">
            This project includes a small number of server API routes for legitimate, limited
            purposes — not because they&apos;re required for normal use of the site:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <code className="text-amber">GET /api/health</code> reports basic service status —
              nothing user-specific.
            </li>
            <li>
              <code className="text-amber">POST /api/results</code> validates a minimal, aggregated
              result payload (WPM, accuracy, duration, and similar numbers). It never receives your
              raw keystrokes or the text you typed. Using it is entirely optional — the Statistics
              page does not depend on it.
            </li>
            <li>
              <code className="text-amber">GET /api/leaderboard</code> is honest about the fact that
              there is currently no global, server-side leaderboard — it returns a message saying
              so, rather than fabricated data.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
