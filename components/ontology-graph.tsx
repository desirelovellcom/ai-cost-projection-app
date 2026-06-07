"use client"

import type { Insights } from "@/lib/models"
import { Workflow, Mic, Cpu, Brain, Sparkles, ArrowRight } from "lucide-react"

export function OntologyGraph({ insights }: { insights: Insights }) {
  const nodes = [
    {
      title: "User Request",
      sub: "Whisper / Text input",
      icon: Mic,
      eff: 100,
      accent: "from-pastel-blue/20 to-pastel-mint/20",
      ring: "ring-pastel-blue/40",
      text: "text-pastel-blue",
    },
    {
      title: "Router Layer",
      sub: "MoE classification",
      icon: Workflow,
      eff: 96,
      accent: "from-pastel-lavender/20 to-pastel-blue/20",
      ring: "ring-pastel-lavender/40",
      text: "text-pastel-lavender",
    },
    {
      title: "Cheap Token Model",
      sub: `${insights.cheapest.model} · embeds & fast pass`,
      icon: Cpu,
      eff: 92,
      accent: "from-pastel-mint/20 to-pastel-blue/20",
      ring: "ring-pastel-mint/40",
      text: "text-pastel-mint",
    },
    {
      title: "Expensive Token Model",
      sub: `${insights.mostCapable.model} · reasoning & final pass`,
      icon: Brain,
      eff: 88,
      accent: "from-pastel-pink/20 to-pastel-coral/20",
      ring: "ring-pastel-pink/40",
      text: "text-pastel-pink",
    },
    {
      title: "High ROI Output",
      sub: `Routed via ${insights.sweetSpot.model}`,
      icon: Sparkles,
      eff: 94,
      accent: "from-pastel-lavender/25 to-pastel-pink/20",
      ring: "ring-pastel-lavender/50",
      text: "text-pastel-lavender",
    },
  ]

  return (
    <div className="rounded-xl border border-border bg-card/50 p-5">
      <div className="mb-1 flex items-center gap-2">
        <Workflow className="size-4 text-accent" />
        <h2 className="text-sm font-medium text-foreground">Spend &amp; Routing Ontology</h2>
      </div>
      <p className="mb-5 text-xs text-muted-foreground">
        How a complex task flows through a Mixture-of-Experts pipeline to maximize ROI.
      </p>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
        {nodes.map((n, i) => (
          <div key={n.title} className="flex flex-1 items-center gap-2 lg:flex-col">
            <div
              className={`flex-1 rounded-xl border border-border bg-gradient-to-br ${n.accent} p-4 ring-1 ${n.ring} lg:w-full`}
            >
              <div className="flex items-center justify-between">
                <n.icon className={`size-5 ${n.text}`} />
                <span className={`font-mono text-xs font-semibold ${n.text}`}>{n.eff}%</span>
              </div>
              <div className="mt-3 text-sm font-medium leading-tight text-foreground">{n.title}</div>
              <div className="mt-1 text-[11px] leading-snug text-muted-foreground">{n.sub}</div>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pastel-lavender via-pastel-pink to-pastel-blue"
                  style={{ width: `${n.eff}%` }}
                />
              </div>
            </div>
            {i < nodes.length - 1 && (
              <ArrowRight className="size-4 shrink-0 rotate-90 text-muted-foreground lg:rotate-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
