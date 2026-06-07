"use client"

import type { Insights } from "@/lib/models"
import { formatUSD } from "@/lib/models"
import { Crown, PiggyBank, Target } from "lucide-react"

export function InsightCards({ insights }: { insights: Insights }) {
  const cards = [
    {
      label: "Cheapest",
      icon: PiggyBank,
      model: insights.cheapest.model,
      value: formatUSD(insights.cheapest.totalCost),
      sub: `${insights.cheapest.provider} · per task`,
      accent: "from-pastel-mint/20 to-pastel-blue/20",
      ring: "ring-pastel-mint/40",
      text: "text-pastel-mint",
    },
    {
      label: "Most Capable",
      icon: Crown,
      model: insights.mostCapable.model,
      value: `ROI ${insights.mostCapable.roiScore.toFixed(1)}`,
      sub: `${insights.mostCapable.provider} · ${formatUSD(insights.mostCapable.totalCost)}`,
      accent: "from-pastel-pink/20 to-pastel-coral/20",
      ring: "ring-pastel-pink/40",
      text: "text-pastel-pink",
    },
    {
      label: "Sweet Spot (Best ROI)",
      icon: Target,
      model: insights.sweetSpot.model,
      value: `${insights.sweetSpot.efficiencyScore}/100`,
      sub: `${insights.sweetSpot.provider} · ${formatUSD(insights.sweetSpot.totalCost)}`,
      accent: "from-pastel-lavender/25 to-pastel-blue/25",
      ring: "ring-pastel-lavender/50",
      text: "text-pastel-lavender",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-xl border border-border bg-gradient-to-br ${c.accent} p-4 ring-1 ${c.ring}`}
        >
          <div className="flex items-center gap-2">
            <c.icon className={`size-4 ${c.text}`} />
            <span className="text-xs font-medium text-muted-foreground">{c.label}</span>
          </div>
          <div className="mt-3 truncate text-base font-semibold text-foreground" title={c.model}>
            {c.model}
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className={`font-mono text-lg font-bold ${c.text}`}>{c.value}</span>
          </div>
          <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}
