export type ModelRate = {
  model: string
  provider: string
  inputCostPerM: number
  outputCostPerM: number
  contextWindow: string
  roiScore: number
}

// Pricing reference modeled on the Artificial Analysis leaderboard.
export const MODELS: ModelRate[] = [
  { model: "GPT-5.5 (Flagship)", provider: "OpenAI", inputCostPerM: 5.0, outputCostPerM: 30.0, contextWindow: "1M", roiScore: 9.4 },
  { model: "Claude Opus 4.8", provider: "Anthropic", inputCostPerM: 5.0, outputCostPerM: 25.0, contextWindow: "1M", roiScore: 9.1 },
  { model: "Claude Sonnet 4.6", provider: "Anthropic", inputCostPerM: 3.0, outputCostPerM: 15.0, contextWindow: "1M", roiScore: 9.7 },
  { model: "GPT-5.4", provider: "OpenAI", inputCostPerM: 2.5, outputCostPerM: 15.0, contextWindow: "128K", roiScore: 9.5 },
  { model: "GPT-4o", provider: "OpenAI", inputCostPerM: 2.5, outputCostPerM: 10.0, contextWindow: "128K", roiScore: 8.9 },
  { model: "Gemini 3.1 Pro (Preview)", provider: "Google", inputCostPerM: 2.0, outputCostPerM: 12.0, contextWindow: "10M", roiScore: 9.3 },
  { model: "Gemini 2.5 Pro", provider: "Google", inputCostPerM: 1.25, outputCostPerM: 10.0, contextWindow: "1M", roiScore: 8.8 },
  { model: "Mistral Large 2", provider: "Mistral", inputCostPerM: 2.0, outputCostPerM: 6.0, contextWindow: "128K", roiScore: 8.6 },
  { model: "DeepSeek R1", provider: "DeepSeek", inputCostPerM: 0.55, outputCostPerM: 2.19, contextWindow: "128K", roiScore: 9.6 },
  { model: "Gemini 3.1 Flash-Lite", provider: "Google", inputCostPerM: 0.25, outputCostPerM: 1.5, contextWindow: "1M", roiScore: 9.2 },
  { model: "GPT-5.4 Mini", provider: "OpenAI", inputCostPerM: 0.75, outputCostPerM: 4.5, contextWindow: "128K", roiScore: 9.0 },
]

export type Preset = {
  id: string
  label: string
  description: string
  inputTokens: number
  outputTokens: number
}

// Roughly 1.33 tokens per word.
export const TOKENS_PER_WORD = 1.33

export const PRESETS: Preset[] = [
  {
    id: "simple",
    label: "Simple Task",
    description: "Short prompt, quick answer",
    inputTokens: 1_500,
    outputTokens: 800,
  },
  {
    id: "medium",
    label: "Medium Data Analysis",
    description: "Analyze a document, summarize findings",
    inputTokens: 60_000,
    outputTokens: 8_000,
  },
  {
    id: "massive",
    label: "Massive Spreadsheet Generation",
    description: "Large context in, structured data out",
    inputTokens: 400_000,
    outputTokens: 60_000,
  },
]

export type ModelProjection = ModelRate & {
  inputTokens: number
  outputTokens: number
  inputCost: number
  outputCost: number
  totalCost: number
  // Cost-per-capability: lower is better. We invert for an efficiency score.
  efficiencyScore: number
}

export function projectCosts(
  inputTokens: number,
  outputTokens: number,
): ModelProjection[] {
  const raw = MODELS.map((m) => {
    const inputCost = (inputTokens / 1_000_000) * m.inputCostPerM
    const outputCost = (outputTokens / 1_000_000) * m.outputCostPerM
    const totalCost = inputCost + outputCost
    // capability per dollar => roiScore / totalCost
    const costPerCapability = totalCost > 0 ? totalCost / m.roiScore : 0
    return { ...m, inputTokens, outputTokens, inputCost, outputCost, totalCost, costPerCapability }
  })

  // Normalize efficiency into a 0-100 score (higher = better value).
  const maxCpc = Math.max(...raw.map((r) => r.costPerCapability), 0.0000001)
  return raw
    .map((r) => {
      const efficiencyScore = Math.round((1 - r.costPerCapability / maxCpc) * 60 + 40)
      const { costPerCapability, ...rest } = r
      return { ...rest, efficiencyScore }
    })
    .sort((a, b) => a.totalCost - b.totalCost)
}

export type Insights = {
  cheapest: ModelProjection
  mostCapable: ModelProjection
  sweetSpot: ModelProjection
}

export function deriveInsights(projections: ModelProjection[]): Insights {
  const cheapest = projections.reduce((a, b) => (a.totalCost <= b.totalCost ? a : b))
  const mostCapable = projections.reduce((a, b) => (a.roiScore >= b.roiScore ? a : b))
  // Sweet spot: best efficiency score (value for capability)
  const sweetSpot = projections.reduce((a, b) => (a.efficiencyScore >= b.efficiencyScore ? a : b))
  return { cheapest, mostCapable, sweetSpot }
}

export function formatUSD(value: number): string {
  if (value === 0) return "$0.00"
  if (value < 0.01) return "<$0.01"
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value < 1 ? 4 : 2 })
}

export function formatTokens(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toString()
}
