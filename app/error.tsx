"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Logged to the browser console only — never rendered to the user.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <AlertTriangle size={32} className="mb-4 text-danger" aria-hidden="true" />
      <h1 className="mb-2 font-mono text-xl font-bold text-paper">Something went wrong</h1>
      <p className="mb-6 max-w-sm text-sm text-muted">
        An unexpected error occurred. Your local typing history is unaffected — try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
