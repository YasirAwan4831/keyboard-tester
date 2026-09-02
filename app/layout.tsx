import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/theme/ThemeProvider";
import "./globals.css";

const SITE_URL = "https://keyboard-tester.vercel.app";
const SITE_TITLE = "Keyboard Tester — Test Your Keyboard & Typing Speed";
const SITE_DESCRIPTION =
  "Test your keyboard keys, check keyboard input, and measure typing speed, WPM, accuracy, and performance with a fast browser-based keyboard tester.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Keyboard Tester",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "keyboard tester",
    "typing test",
    "wpm test",
    "keyboard key test",
    "typing speed test",
    "keyboard diagnostics",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Keyboard Tester",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0c10" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before hydration so the correct theme class is present for first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
