"use client";

import Link from "next/link";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { StatsCards } from "@/components/stats/StatsCards";
import { TestHistory } from "@/components/stats/TestHistory";
import { PerformanceChart } from "@/components/stats/PerformanceChart";
import { Button } from "@/components/ui/Button";

export default function StatsPage() {
  const { history, aggregateStats, isLoaded, clear } = useLocalStorage();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-mono text-3xl font-bold text-paper sm:text-4xl">Statistics</h1>
          <p className="mt-2 text-muted">Your typing history, stored locally on this device.</p>
        </div>
        <Link href="/typing-test">
          <Button size="sm">Take a Test</Button>
        </Link>
      </div>

      {!isLoaded ? (
        <div className="py-16 text-center text-sm text-muted">Loading your local history…</div>
      ) : (
        <div className="flex flex-col gap-6">
          <StatsCards stats={aggregateStats} />
          <PerformanceChart results={history.results} />
          <TestHistory results={history.results} onClear={clear} />
        </div>
      )}
    </div>
  );
}
