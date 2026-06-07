"use client"

import { useState } from "react"
import type { ModelProjection } from "@/lib/models"
import { Wand2, Copy, Check } from "lucide-react"

export function PromptOptimizer({ model }: { model: ModelProjection }) {
  const [copied, setCopied] = useState(false)

  const systemPrompt = `You are ${model.model}. Optimize for token efficiency:
- Omit conversational filler, greetings, and restatements of the question.
- Return only the requested content; no preamble or sign-off.
- Use compact formatting (tables/JSON) over prose when structured data is requested.
- Reason internally; output only conclusions unless reasoning is explicitly asked for.
- Cap responses to the minimum tokens needed to be correct and complete.`

  async function copy() {
    try {
      await navigator.clipboard.writeText(systemPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard not available
    }
  }

  // Estimated savings on output tokens
  const savedTokens = Math.round(model.outputTokens * 0.18)
  const savedCost = (savedTokens / 1_000_000) * model.outputCostPerM

  return (
    <div className="rounded-xl border border-border bg-card/50 p-5">
      <div className="mb-1 flex items-center gap-2">
        <Wand2 className="size-4 text-accent" />
        <h2 className="text-sm font-medium text-foreground">System Prompt Optimizer</h2>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Tuned for <span className="text-foreground">{model.model}</span>. Omitting conversational filler saves an
        average of <span className="font-medium text-pastel-mint">18%</span> on output tokens — roughly{" "}
        <span className="font-mono text-pastel-mint">
          {savedTokens.toLocaleString()} tokens (${savedCost.toFixed(2)})
        </span>{" "}
        on this task.
      </p>

      <div className="relative">
        <pre className="max-h-56 overflow-auto rounded-lg border border-border bg-secondary/40 p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
          {systemPrompt}
        </pre>
        <button
          onClick={copy}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-pastel-lavender via-pastel-pink to-pastel-blue px-3 py-1.5 text-xs font-medium text-primary-foreground transition-transform hover:scale-105"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  )
}
