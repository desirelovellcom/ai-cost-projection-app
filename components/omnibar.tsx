"use client"

import type React from "react"
import { useState } from "react"
import { Mic, Sparkles, CornerDownLeft } from "lucide-react"

const SUGGESTIONS = [
  "How much to analyze a 50-page PDF and generate a spreadsheet using Claude Sonnet 4.6?",
  "Analyze 10,000 words across 5 models",
  "Summarize a 200-page report with Gemini 3.1 Pro",
  "Generate a massive spreadsheet from 400k tokens of data",
]

export function Omnibar({
  onSubmit,
}: {
  onSubmit: (text: string) => void
}) {
  const [value, setValue] = useState("")
  const [listening, setListening] = useState(false)

  function submit(text: string) {
    const t = text.trim()
    if (!t) return
    onSubmit(t)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    submit(value)
  }

  function handleMic() {
    // Simulated voice activation
    setListening(true)
    const sample = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)]
    setTimeout(() => {
      setValue(sample)
      setListening(false)
      submit(sample)
    }, 1100)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-pastel-lavender via-pastel-pink to-pastel-blue opacity-60 blur-[2px]" />
        <div className="relative flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={handleMic}
            aria-label="Activate voice search"
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-pastel-lavender via-pastel-pink to-pastel-blue text-primary-foreground transition-transform hover:scale-105 ${
              listening ? "animate-pulse" : ""
            }`}
          >
            <Mic className="size-5" />
          </button>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              listening
                ? "Listening…"
                : "Ask desirelovell: 'How much would it cost to analyze a 50-page PDF and generate a spreadsheet using Claude Sonnet 4.6?'"
            }
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 outline-none md:text-base"
          />
          <button
            type="submit"
            className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-secondary-foreground transition-colors hover:bg-muted sm:flex"
          >
            Run
            <CornerDownLeft className="size-3.5" />
          </button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-accent" /> Try:
        </span>
        {SUGGESTIONS.slice(0, 3).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setValue(s)
              submit(s)
            }}
            className="rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-pastel-lavender/50 hover:text-foreground"
          >
            {s.length > 52 ? s.slice(0, 52) + "…" : s}
          </button>
        ))}
      </div>
    </div>
  )
}
