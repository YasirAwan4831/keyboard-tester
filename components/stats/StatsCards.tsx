import type { AggregateStats } from "@/types";
import { Card } from "@/components/ui/Card";

interface StatsCardsProps {
  stats: AggregateStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { label: "Best WPM", value: stats.bestWpm },
    { label: "Average WPM", value: stats.averageWpm },
    { label: "Best Accuracy", value: `${stats.bestAccuracy}%` },
    { label: "Average Accuracy", value: `${stats.averageAccuracy}%` },
    { label: "Total Tests", value: stats.totalTests },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label} className="text-center">
          <div className="font-mono text-2xl font-bold text-paper sm:text-3xl">{card.value}</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-wide text-muted">
            {card.label}
          </div>
        </Card>
      ))}
    </div>
  );
}
