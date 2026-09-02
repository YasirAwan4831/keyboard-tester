"use client";

import type { TypingTestResult } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface PerformanceChartProps {
  results: TypingTestResult[];
}

const WIDTH = 640;
const HEIGHT = 160;
const PADDING = 24;

export function PerformanceChart({ results }: PerformanceChartProps) {
  // Results are stored newest-first; the chart reads left-to-right chronologically.
  const chronological = [...results].reverse().slice(-30);

  if (chronological.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>WPM Trend</CardTitle>
        </CardHeader>
        <p className="py-6 text-center text-sm text-muted">
          Complete at least two typing tests to see your trend over time.
        </p>
      </Card>
    );
  }

  const wpmValues = chronological.map((r) => r.wpm);
  const maxWpm = Math.max(...wpmValues, 10);
  const minWpm = Math.min(...wpmValues, 0);
  const range = Math.max(maxWpm - minWpm, 1);

  const points = chronological.map((r, i) => {
    const x = PADDING + (i / (chronological.length - 1)) * (WIDTH - PADDING * 2);
    const y = HEIGHT - PADDING - ((r.wpm - minWpm) / range) * (HEIGHT - PADDING * 2);
    return { x, y, wpm: r.wpm };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x.toFixed(1)} ${HEIGHT - PADDING} L ${points[0]?.x.toFixed(1)} ${HEIGHT - PADDING} Z`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>WPM Trend</CardTitle>
        <span className="font-mono text-xs text-muted">Last {chronological.length} tests</span>
      </CardHeader>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Line chart of words per minute across recent typing tests">
        <path d={areaPath} fill="var(--color-amber-soft)" stroke="none" />
        <path d={linePath} fill="none" stroke="var(--color-amber)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="var(--color-amber)" />
        ))}
      </svg>
    </Card>
  );
}
