"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./Header";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

export function MobileMenu({ open, onClose, pathname }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-[color:var(--color-overlay)]"
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        aria-label="Mobile navigation"
        className="absolute right-0 top-0 flex h-full w-72 flex-col gap-1 border-l border-mist bg-surface p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-sm font-semibold text-paper">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-key border border-mist text-paper"
          >
            <X size={16} />
          </button>
        </div>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "rounded-key px-3 py-2.5 font-mono text-sm",
              pathname === link.href ? "bg-amber-soft text-amber" : "text-muted hover:text-paper"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
