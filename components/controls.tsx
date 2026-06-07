"use client"

import { PRESETS, formatTokens } from "@/lib/models"
import { SlidersHorizontal } from "lucide-react"

export function Controls({
  inputTokens,
  outputTokens,
  activePreset,
  onPreset,
  onInputChange,
  onOutputChange,
}: {
  inputTokens: number
  outputTokens: number
  activePreset: string | null
  onPreset: (id: string) => void
  onInputChange: (v: number) => void
  onOutputChange: (v: number) => void
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-accent" />
        <h2 className="text-sm font-medium text-foreground">Task Estimator</h2>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {PRESETS.map((p) => {
          const active = activePreset === p.id
          return (
            <button
              key={p.id}
              onClick={() => onPreset(p.id)}
              className={`rounded-lg border p-3 text-left transition-colors ${
                active
                  ? "border-transparent bg-gradient-to-br from-pastel-lavender/25 to-pastel-blue/25 ring-1 ring-pastel-lavender/50"
                  : "border-border bg-secondary/50 hover:border-pastel-lavender/40"
              }`}
            >
              <div className="text-xs font-medium text-foreground">{p.label}</div>
              <div className="mt-1 text-[11px] leading-snug text-muted-foreground">{p.description}</div>
            </button>
          )
        })}
      </div>

      <div className="space-y-5">
        <SliderRow
          label="Input Tokens"
          value={inputTokens}
          min={500}
          max={1_000_000}
          step={500}
          accent="from-pastel-blue to-pastel-mint"
          onChange={onInputChange}
        />
        <SliderRow
          label="Output Tokens"
          value={outputTokens}
          min={200}
          max={200_000}
          step={200}
          accent="from-pastel-pink to-pastel-coral"
          onChange={onOutputChange}
        />
      </div>
    </div>
  )
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  accent,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  accent: string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-xs text-muted-foreground">{label}</label>
        <span
          className={`bg-gradient-to-r ${accent} bg-clip-text font-mono text-sm font-semibold text-transparent`}
        >
          {formatTokens(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(value, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="dl-range w-full"
      />
    </div>
  )
}
