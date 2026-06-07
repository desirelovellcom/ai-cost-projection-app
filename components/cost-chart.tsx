"use client"

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import type { ModelProjection, Insights } from "@/lib/models"
import { formatUSD } from "@/lib/models"
import { BarChart3 } from "lucide-react"

export function CostChart({
  projections,
  insights,
}: {
  projections: ModelProjection[]
  insights: Insights
}) {
  // Show top 7 by value/relevance, keep cheapest ordering
  const data = projections.slice(0, 7).map((p) => ({
    name: p.model.replace(/ \(.*\)/, ""),
    total: Number(p.totalCost.toFixed(4)),
    model: p.model,
  }))

  function colorFor(model: string) {
    if (model === insights.sweetSpot.model) return "var(--pastel-lavender)"
    if (model === insights.cheapest.model) return "var(--pastel-mint)"
    if (model === insights.mostCapable.model) return "var(--pastel-pink)"
    return "var(--pastel-blue)"
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="size-4 text-accent" />
        <h2 className="text-sm font-medium text-foreground">Cost Projection</h2>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
            <XAxis
              type="number"
              tickFormatter={(v) => formatUSD(v)}
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "var(--secondary)", opacity: 0.4 }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                fontSize: "12px",
                color: "var(--popover-foreground)",
              }}
              formatter={(v: number) => [formatUSD(v), "Total cost"]}
            />
            <Bar dataKey="total" radius={[0, 6, 6, 0]} isAnimationActive>
              {data.map((d) => (
                <Cell key={d.model} fill={colorFor(d.model)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
        <Legend color="var(--pastel-lavender)" label="Sweet Spot" />
        <Legend color="var(--pastel-mint)" label="Cheapest" />
        <Legend color="var(--pastel-pink)" label="Most Capable" />
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="size-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  )
}
