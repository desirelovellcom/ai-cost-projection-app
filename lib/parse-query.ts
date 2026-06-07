import { MODELS, TOKENS_PER_WORD, PRESETS, type Preset } from "./models"

export type ParsedQuery = {
  inputTokens: number
  outputTokens: number
  matchedModel?: string
  note: string
}

/**
 * Lightweight natural-language parser. Looks for word counts, page counts,
 * model names, and task verbs to estimate input/output tokens.
 */
export function parseQuery(text: string, current: { inputTokens: number; outputTokens: number }): ParsedQuery {
  const lower = text.toLowerCase()
  let inputTokens = current.inputTokens
  let outputTokens = current.outputTokens
  const reasons: string[] = []

  // Page count, e.g. "50-page PDF" (~500 words/page)
  const pageMatch = lower.match(/(\d[\d,]*)\s*[- ]?\s*page/)
  if (pageMatch) {
    const pages = Number(pageMatch[1].replace(/,/g, ""))
    inputTokens = Math.round(pages * 500 * TOKENS_PER_WORD)
    reasons.push(`${pages} pages ≈ ${inputTokens.toLocaleString()} input tokens`)
  }

  // Word count, e.g. "10,000 words"
  const wordMatch = lower.match(/(\d[\d,]*)\s*words?/)
  if (wordMatch) {
    const words = Number(wordMatch[1].replace(/,/g, ""))
    inputTokens = Math.round(words * TOKENS_PER_WORD)
    reasons.push(`${words.toLocaleString()} words ≈ ${inputTokens.toLocaleString()} input tokens`)
  }

  // Explicit token count, e.g. "100k tokens"
  const tokenMatch = lower.match(/(\d[\d,.]*)\s*(k|m)?\s*tokens?/)
  if (tokenMatch) {
    let n = Number(tokenMatch[1].replace(/,/g, ""))
    if (tokenMatch[2] === "k") n *= 1_000
    if (tokenMatch[2] === "m") n *= 1_000_000
    inputTokens = Math.round(n)
    reasons.push(`${inputTokens.toLocaleString()} input tokens`)
  }

  // Task type heuristics for output sizing
  if (/spreadsheet|table|csv|dataset|generate.*data/.test(lower)) {
    outputTokens = Math.max(outputTokens, Math.round(inputTokens * 0.25), 20_000)
    reasons.push("structured data generation → larger output")
  } else if (/summar|extract|classif|tag/.test(lower)) {
    outputTokens = Math.max(2_000, Math.round(inputTokens * 0.05))
    reasons.push("summarization → compact output")
  } else if (/write|draft|essay|article|report|generate/.test(lower)) {
    outputTokens = Math.max(outputTokens, 8_000)
    reasons.push("long-form generation → moderate output")
  }

  // Preset keywords
  const presetMatch = matchPreset(lower)
  if (presetMatch && !pageMatch && !wordMatch && !tokenMatch) {
    inputTokens = presetMatch.inputTokens
    outputTokens = presetMatch.outputTokens
    reasons.push(`matched preset: ${presetMatch.label}`)
  }

  // Model mention
  const matchedModel = MODELS.find((m) => lower.includes(m.model.toLowerCase().split(" (")[0].toLowerCase()))?.model

  return {
    inputTokens,
    outputTokens,
    matchedModel,
    note: reasons.length ? reasons.join(" · ") : "Estimated from your current token settings",
  }
}

function matchPreset(lower: string): Preset | undefined {
  if (/massive|huge|large|spreadsheet/.test(lower)) return PRESETS[2]
  if (/medium|analy|document|pdf/.test(lower)) return PRESETS[1]
  if (/simple|quick|short/.test(lower)) return PRESETS[0]
  return undefined
}
