export interface GrammarIssue {
  message: string
  offset: number
  length: number
  type: string
  category: string
  replacements: string[]
  context: string
  original: string
}

interface LTMatch {
  message: string
  offset: number
  length: number
  replacements: Array<{ value: string }>
  rule: {
    id: string
    description: string
    issueType: string
    category: { id: string; name: string }
  }
}

export async function checkGrammar(
  text: string,
  language = 'en-US'
): Promise<GrammarIssue[]> {
  if (!text.trim()) return []

  const params = new URLSearchParams({
    text,
    language,
    enabledOnly: 'false',
  })

  const response = await fetch('https://api.languagetool.org/v2/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!response.ok) {
    throw new Error(`Grammar check failed: ${response.status}`)
  }

  const data = await response.json()
  return ((data.matches as LTMatch[]) || []).map((m) => ({
    message: m.message,
    offset: m.offset,
    length: m.length,
    type: m.rule.issueType,
    category: m.rule.category.name,
    replacements: m.replacements.slice(0, 5).map((r) => r.value),
    original: text.substring(m.offset, m.offset + m.length),
    context: text.substring(
      Math.max(0, m.offset - 25),
      Math.min(text.length, m.offset + m.length + 25)
    ),
  }))
}

export interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  avgWordsPerSentence: number
  uniqueWords: number
  vocabularyDiversity: number
  readingTime: number
  fleschScore: number
  fleschLevel: string
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (w.length <= 3) return 1
  let count = 0
  let prevVowel = false
  for (let i = 0; i < w.length; i++) {
    const isVowel = 'aeiouy'.includes(w[i])
    if (isVowel && !prevVowel) count++
    prevVowel = isVowel
  }
  if (w.endsWith('e')) count--
  return Math.max(count, 1)
}

function fleschToLevel(score: number): string {
  if (score >= 90) return 'Muito fácil (5ª série)'
  if (score >= 80) return 'Fácil (6ª série)'
  if (score >= 70) return 'Razoavelmente fácil (7ª série)'
  if (score >= 60) return 'Padrão (8-9ª série)'
  if (score >= 50) return 'Razoavelmente difícil (10-12ª série)'
  if (score >= 30) return 'Difícil (Universidade)'
  return 'Muito difícil (Pós-graduação)'
}

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim()
  if (!trimmed) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      avgWordsPerSentence: 0,
      uniqueWords: 0,
      vocabularyDiversity: 0,
      readingTime: 0,
      fleschScore: 0,
      fleschLevel: 'N/A',
    }
  }

  const characters = trimmed.length
  const charactersNoSpaces = trimmed.replace(/\s/g, '').length
  const words = trimmed.split(/\s+/).filter(Boolean)
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0)

  const wordCount = words.length
  const sentenceCount = Math.max(sentences.length, 1)
  const paragraphCount = Math.max(paragraphs.length, 1)

  const uniqueWordsSet = new Set(
    words.map((w) => w.toLowerCase().replace(/[^a-z']/g, ''))
  )
  uniqueWordsSet.delete('')

  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
  const fleschScore = Math.max(
    0,
    Math.min(
      100,
      206.835 -
        1.015 * (wordCount / sentenceCount) -
        84.6 * (totalSyllables / Math.max(wordCount, 1))
    )
  )

  return {
    characters,
    charactersNoSpaces,
    words: wordCount,
    sentences: sentenceCount,
    paragraphs: paragraphCount,
    avgWordsPerSentence: wordCount / sentenceCount,
    uniqueWords: uniqueWordsSet.size,
    vocabularyDiversity: uniqueWordsSet.size / Math.max(wordCount, 1),
    readingTime: Math.ceil(wordCount / 200),
    fleschScore: Math.round(fleschScore),
    fleschLevel: fleschToLevel(fleschScore),
  }
}

export interface WritingFeedback {
  score: number
  stats: TextStats
  strengths: string[]
  suggestions: string[]
  warnings: string[]
}

export function generateFeedback(
  text: string,
  exercise: { minWords: number; maxWords: number; difficulty: string }
): WritingFeedback {
  const stats = analyzeText(text)
  const strengths: string[] = []
  const suggestions: string[] = []
  const warnings: string[] = []
  let score = 0

  // Word count (30 pts)
  if (stats.words >= exercise.minWords && stats.words <= exercise.maxWords) {
    score += 30
    strengths.push(
      `✓ Tamanho ideal: ${stats.words} palavras (esperado ${exercise.minWords}-${exercise.maxWords})`
    )
  } else if (stats.words < exercise.minWords) {
    score += Math.round((stats.words / exercise.minWords) * 30)
    warnings.push(
      `Texto curto: ${stats.words} palavras (mínimo: ${exercise.minWords})`
    )
  } else {
    score += 22
    suggestions.push(
      `Texto longo: ${stats.words} palavras (máximo: ${exercise.maxWords})`
    )
  }

  // Vocabulary diversity (20 pts)
  const diversityPct = Math.round(stats.vocabularyDiversity * 100)
  if (stats.vocabularyDiversity >= 0.6) {
    score += 20
    strengths.push(`✓ Excelente variedade de vocabulário (${diversityPct}% únicas)`)
  } else if (stats.vocabularyDiversity >= 0.4) {
    score += 12
    suggestions.push(`Vocabulário razoável (${diversityPct}% únicas) — tente sinônimos`)
  } else {
    score += 5
    warnings.push(`Vocabulário repetitivo (${diversityPct}% únicas)`)
  }

  // Sentence variety (20 pts)
  const avgWPS = Math.round(stats.avgWordsPerSentence)
  if (avgWPS >= 12 && avgWPS <= 22) {
    score += 20
    strengths.push(`✓ Boa estrutura de frases (média ${avgWPS} palavras)`)
  } else if (avgWPS < 12) {
    score += 10
    suggestions.push(`Frases curtas (média ${avgWPS} palavras) — combine ideias`)
  } else {
    score += 10
    suggestions.push(`Frases longas (média ${avgWPS} palavras) — divida em menores`)
  }

  // Paragraphs (15 pts)
  if (stats.paragraphs >= 2) {
    score += 15
    strengths.push(`✓ Texto estruturado em ${stats.paragraphs} parágrafos`)
  } else {
    score += 5
    suggestions.push('Divida o texto em parágrafos (use linha em branco)')
  }

  // Readability (15 pts)
  if (stats.fleschScore >= 50) {
    score += 15
    strengths.push(`✓ Nível de leitura: ${stats.fleschLevel}`)
  } else {
    score += 7
    suggestions.push(`Texto difícil de ler: ${stats.fleschLevel}`)
  }

  return { score: Math.min(100, score), stats, strengths, suggestions, warnings }
}

export interface SavedSubmission {
  id: string
  exerciseTitle: string
  content: string
  submittedAt: string
  feedback: WritingFeedback
}

const STORAGE_KEY = 'writing-submissions'

export function loadSubmissions(): SavedSubmission[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveSubmission(submission: SavedSubmission): void {
  if (typeof window === 'undefined') return
  const all = loadSubmissions()
  all.unshift(submission)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, 20)))
}

export function deleteSubmission(id: string): SavedSubmission[] {
  if (typeof window === 'undefined') return []
  const all = loadSubmissions().filter((s) => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  return all
}

const DRAFT_KEY = 'writing-draft'

export function loadDraft(exerciseId: string): string {
  if (typeof window === 'undefined') return ''
  try {
    const drafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}')
    return drafts[exerciseId] || ''
  } catch {
    return ''
  }
}

export function saveDraft(exerciseId: string, content: string): void {
  if (typeof window === 'undefined') return
  try {
    const drafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}')
    drafts[exerciseId] = content
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts))
  } catch {
    // ignore
  }
}

export function clearDraft(exerciseId: string): void {
  if (typeof window === 'undefined') return
  try {
    const drafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}')
    delete drafts[exerciseId]
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts))
  } catch {
    // ignore
  }
}

export function downloadAsText(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
