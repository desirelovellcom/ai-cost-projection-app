"use client"

import { useMemo, useState } from "react"
import { PRESETS, projectCosts, deriveInsights } from "@/lib/models"
import { parseQuery } from "@/lib/parse-query"
import { Omnibar } from "@/components/omnibar"
import { Controls } from "@/components/controls"
import { InsightCards } from "@/components/insight-cards"
import { PredictiveMatrix } from "@/components/predictive-matrix"
import { CostChart } from "@/components/cost-chart"
import { OntologyGraph } from "@/components/ontology-graph"
import { PromptOptimizer } from "@/components/prompt-optimizer"

export default function Page() {
  const [inputTokens, setInputTokens] = useState(PRESETS[1].inputTokens)
  const [outputTokens, setOutputTokens] = useState(PRESETS[1].outputTokens)
  const [activePreset, setActivePreset] = useState<string | null>("medium")
  const [queryNote, setQueryNote] = useState<string | null>(null)
  const [highlightModel, setHighlightModel] = useState<string | undefined>(undefined)
  const [calcKey, setCalcKey] = useState(0)

  const projections = useMemo(() => projectCosts(inputTokens, outputTokens), [inputTokens, outputTokens])
  const insights = useMemo(() => deriveInsights(projections), [projections])
  const optimizerModel = useMemo(() => {
    if (highlightModel) return projections.find((p) => p.model === highlightModel) ?? insights.sweetSpot
    return insights.sweetSpot
  }, [projections, insights, highlightModel])

  function handlePreset(id: string) {
    const p = PRESETS.find((x) => x.id === id)
    if (!p) return
    setInputTokens(p.inputTokens)
    setOutputTokens(p.outputTokens)
    setActivePreset(id)
    setQueryNote(null)
    setHighlightModel(undefined)
    setCalcKey((k) => k + 1)
  }

  function handleQuery(text: string) {
    const parsed = parseQuery(text, { inputTokens, outputTokens })
    setInputTokens(parsed.inputTokens)
    setOutputTokens(parsed.outputTokens)
    setActivePreset(null)
    setHighlightModel(parsed.matchedModel)
    setQueryNote(parsed.note)
    setCalcKey((k) => k + 1)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-pastel-lavender/10 via-pastel-pink/5 to-transparent blur-2xl"
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <Header />

        <div className="mt-8">
          <Omnibar onSubmit={handleQuery} />
          {queryNote && (
            <p className="mt-3 rounded-lg border border-border bg-card/40 px-3 py-2 text-xs text-muted-foreground">
              <span className="text-accent">Interpreted:</span> {queryNote}
            </p>
          )}
        </div>

        <div key={calcKey} className="dl-fade mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Controls
              inputTokens={inputTokens}
              outputTokens={outputTokens}
              activePreset={activePreset}
              onPreset={handlePreset}
              onInputChange={(v) => {
                setInputTokens(v)
                setActivePreset(null)
              }}
              onOutputChange={(v) => {
                setOutputTokens(v)
                setActivePreset(null)
              }}
            />
          </div>
          <div className="lg:col-span-2">
            <InsightCards insights={insights} />
          </div>
        </div>

        <div className="dl-fade mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CostChart projections={projections} insights={insights} />
          <PredictiveMatrix projections={projections} insights={insights} highlightModel={highlightModel} />
        </div>

        <div className="dl-fade mt-6">
          <OntologyGraph insights={insights} />
        </div>

        <div className="dl-fade mt-6">
          <PromptOptimizer model={optimizerModel} />
        </div>

        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          desirelovell · projections modeled on Artificial Analysis leaderboard pricing · estimates only
        </footer>
      </div>
    </main>
  )
}

function Header() {
  return (
    <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="bg-gradient-to-r from-pastel-lavender via-pastel-pink to-pastel-blue bg-clip-text text-3xl font-semibold lowercase tracking-tight text-transparent drop-shadow-[0_0_18px_rgba(200,180,255,0.25)] sm:text-4xl">
          desirelovell
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">AI cost projection &amp; token optimization workspace</p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-pastel-mint opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-pastel-mint" />
        </span>
        <span className="text-xs text-muted-foreground">Token Market Rates: Updated</span>
      </div>
    </header>
  )
}
