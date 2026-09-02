import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <KeyRound size={32} className="mb-4 text-amber" aria-hidden="true" />
      <h1 className="mb-2 font-mono text-2xl font-bold text-paper">404 — Key not found</h1>
      <p className="mb-6 max-w-sm text-sm text-muted">
        That page doesn&apos;t exist. Let&apos;s get you back to something that works.
      </p>
      <Link href="/">
        <Button>Back to Keyboard Tester</Button>
      </Link>
    </div>
  );
}
