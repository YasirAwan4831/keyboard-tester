import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "amber" | "mint" | "danger" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "border-mist text-muted",
  amber: "border-amber text-amber",
  mint: "border-mint text-mint",
  danger: "border-danger text-danger",
  info: "border-info text-info",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide",
        TONE_CLASSES[tone],
        className
      )}
      {...props}
    />
  );
}
