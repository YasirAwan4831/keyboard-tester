import Link from "next/link";
import { Keyboard } from "lucide-react";

const FOOTER_LINKS = [
  { href: "/typing-test", label: "Typing Test" },
  { href: "/stats", label: "Statistics" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  return (
    <footer className="border-t border-mist">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-paper">
            <Keyboard size={16} className="text-amber" />
            Keyboard Tester
          </div>
          <p className="mt-2 text-sm text-muted">
            Test your keyboard keys and measure your typing speed — entirely in your browser.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="font-mono text-sm text-muted hover:text-paper">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-mist px-4 py-4 text-center font-mono text-xs text-muted sm:px-6">
        © {new Date().getFullYear()} Keyboard Tester. No account required. No mandatory database.
      </div>
    </footer>
  );
}
