"use client"

import type { ModelProjection, Insights } from "@/lib/models"
import { formatUSD } from "@/lib/models"
import { Table2 } from "lucide-react"

export function PredictiveMatrix({
  projections,
  insights,
  highlightModel,
}: {
  projections: ModelProjection[]
  insights: Insights
  highlightModel?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Table2 className="size-4 text-accent" />
        <h2 className="text-sm font-medium text-foreground">Predictive Matrix</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Model</th>
              <th className="py-2 px-3 text-right font-medium">Input</th>
              <th className="py-2 px-3 text-right font-medium">Output</th>
              <th className="py-2 px-3 text-right font-medium">Total</th>
              <th className="py-2 pl-3 text-right font-medium">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((p) => {
              const isSweet = p.model === insights.sweetSpot.model
              const isCheap = p.model === insights.cheapest.model
              const isHighlight = p.model === highlightModel
              return (
                <tr
                  key={p.model}
                  className={`border-b border-border/60 transition-colors ${
                    isHighlight ? "bg-pastel-lavender/10" : "hover:bg-secondary/40"
                  }`}
                >
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{p.model}</span>
                      {isSweet && (
                        <span className="rounded-full bg-pastel-lavender/20 px-2 py-0.5 text-[10px] font-medium text-pastel-lavender">
                          Sweet Spot
                        </span>
                      )}
                      {isCheap && !isSweet && (
                        <span className="rounded-full bg-pastel-mint/20 px-2 py-0.5 text-[10px] font-medium text-pastel-mint">
                          Cheapest
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {p.provider} · {p.contextWindow} ctx
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-muted-foreground">{formatUSD(p.inputCost)}</td>
                  <td className="py-3 px-3 text-right font-mono text-muted-foreground">{formatUSD(p.outputCost)}</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-foreground">
                    {formatUSD(p.totalCost)}
                  </td>
                  <td className="py-3 pl-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-pastel-lavender to-pastel-mint"
                          style={{ width: `${p.efficiencyScore}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-mono text-xs text-foreground">{p.efficiencyScore}</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
