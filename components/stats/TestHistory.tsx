"use client";

import { useState } from "react";
import { Trash2, Keyboard as KeyboardIcon } from "lucide-react";
import Link from "next/link";
import type { TypingTestResult } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface TestHistoryProps {
  results: TypingTestResult[];
  onClear: () => void;
}

const GRADE_TONE: Record<TypingTestResult["grade"], "mint" | "amber" | "info" | "danger"> = {
  S: "mint",
  A: "mint",
  B: "amber",
  C: "info",
  D: "danger",
};

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TestHistory({ results, onClear }: TestHistoryProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (results.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 py-12 text-center">
        <KeyboardIcon size={28} className="text-muted" aria-hidden="true" />
        <p className="text-sm text-muted">No typing tests completed yet.</p>
        <Link href="/typing-test">
          <Button size="sm">Take Your First Test</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Results</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
          <Trash2 size={14} /> Clear history
        </Button>
      </CardHeader>

      <div className="scrollbar-thin -mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[520px] text-left font-mono text-sm">
          <thead>
            <tr className="border-b border-mist text-[11px] uppercase tracking-wide text-muted">
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">WPM</th>
              <th className="pb-2 font-medium">Accuracy</th>
              <th className="pb-2 font-medium">Duration</th>
              <th className="pb-2 font-medium">Difficulty</th>
              <th className="pb-2 font-medium">Grade</th>
            </tr>
          </thead>
          <tbody>
            {results.slice(0, 20).map((r) => (
              <tr key={r.id} className="border-b border-mist last:border-0">
                <td className="py-2.5 text-muted">{formatTimestamp(r.timestamp)}</td>
                <td className="py-2.5 text-paper">{r.wpm}</td>
                <td className="py-2.5 text-paper">{r.accuracy}%</td>
                <td className="py-2.5 text-paper">{r.config.duration}s</td>
                <td className="py-2.5 capitalize text-paper">{r.config.difficulty}</td>
                <td className="py-2.5">
                  <Badge tone={GRADE_TONE[r.grade]}>{r.grade}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Clear all history?">
        <p className="mb-5 text-sm text-muted">
          This removes every stored result from this browser. It cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClear();
              setConfirmOpen(false);
            }}
          >
            Clear history
          </Button>
        </div>
      </Modal>
    </Card>
  );
}
