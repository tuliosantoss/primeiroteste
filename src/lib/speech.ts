export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false
  const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition)
}

export function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false
  return typeof window.speechSynthesis !== 'undefined'
}

export function speak(text: string, lang = 'en-US', rate = 0.9): void {
  if (!isSpeechSynthesisSupported()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = rate
  window.speechSynthesis.speak(utterance)
}

export interface DialogueLine {
  speaker: string
  text: string
  pitch?: number
  rate?: number
}

export interface SequencePlayer {
  cancel: () => void
  pause: () => void
  resume: () => void
}

export function playDialogue(
  lines: DialogueLine[],
  options: {
    lang?: string
    onLineChange?: (index: number) => void
    onComplete?: () => void
    onError?: (error: string) => void
  } = {}
): SequencePlayer {
  const { lang = 'en-US', onLineChange, onComplete, onError } = options

  if (!isSpeechSynthesisSupported()) {
    onError?.('Síntese de voz não suportada neste navegador')
    return { cancel: () => {}, pause: () => {}, resume: () => {} }
  }

  window.speechSynthesis.cancel()
  let cancelled = false
  let index = 0

  const playNext = () => {
    if (cancelled) return
    if (index >= lines.length) {
      onComplete?.()
      return
    }

    const line = lines[index]
    onLineChange?.(index)

    const utter = new SpeechSynthesisUtterance(line.text)
    utter.lang = lang
    utter.rate = line.rate ?? 0.9
    utter.pitch = line.pitch ?? 1
    utter.onend = () => {
      index++
      playNext()
    }
    utter.onerror = () => {
      index++
      playNext()
    }

    window.speechSynthesis.speak(utter)
  }

  playNext()

  return {
    cancel: () => {
      cancelled = true
      window.speechSynthesis.cancel()
    },
    pause: () => window.speechSynthesis.pause(),
    resume: () => window.speechSynthesis.resume(),
  }
}

export interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

export interface SpeechRecognitionEventLike {
  results: ArrayLike<{
    isFinal: boolean
    0: { transcript: string }
  }>
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix: number[][] = []
  for (let j = 0; j <= b.length; j++) matrix[j] = [j]
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1]
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1
        )
      }
    }
  }
  return matrix[b.length][a.length]
}

export interface SpeakingScores {
  accuracy: number
  pronunciation: number
  fluency: number
  feedback: string[]
}

export function analyzeSpeaking(
  transcript: string,
  target: string,
  durationMs: number
): SpeakingScores {
  const normT = normalize(transcript)
  const normTarget = normalize(target)

  const transcriptWords = normT.length ? normT.split(' ') : []
  const targetWords = normTarget.length ? normTarget.split(' ') : []

  // Accuracy: word-level match
  const remaining = [...targetWords]
  let matchedWords = 0
  for (const word of transcriptWords) {
    const idx = remaining.indexOf(word)
    if (idx >= 0) {
      matchedWords++
      remaining.splice(idx, 1)
    }
  }
  const accuracy =
    targetWords.length === 0
      ? 0
      : Math.round((matchedWords / targetWords.length) * 100)

  // Pronunciation: character-level similarity via Levenshtein
  const lev = levenshtein(normT, normTarget)
  const maxLen = Math.max(normT.length, normTarget.length, 1)
  const pronunciation = Math.round((1 - lev / maxLen) * 100)

  // Fluency: WPM compared to ideal range (110-160 = normal English)
  const durationSec = Math.max(durationMs / 1000, 0.5)
  const wpm = (transcriptWords.length / durationSec) * 60
  let fluency: number
  if (transcriptWords.length === 0) {
    fluency = 0
  } else if (wpm >= 110 && wpm <= 160) {
    fluency = 95
  } else if (wpm < 110) {
    fluency = Math.max(40, Math.round((wpm / 110) * 95))
  } else {
    fluency = Math.max(40, Math.round((160 / wpm) * 95))
  }

  const feedback: string[] = []

  if (transcriptWords.length === 0) {
    feedback.push('⚠ Nenhuma fala detectada. Verifique se o microfone está habilitado.')
    return { accuracy, pronunciation, fluency, feedback }
  }

  if (accuracy >= 90) {
    feedback.push('✓ Excelente! Você pronunciou quase todas as palavras corretamente.')
  } else if (accuracy >= 70) {
    feedback.push('✓ Bom trabalho! A maioria das palavras foi reconhecida.')
  } else if (accuracy >= 40) {
    feedback.push('ℹ Algumas palavras divergiram. Tente novamente com mais clareza.')
  } else {
    feedback.push('⚠ A frase ficou bem diferente da esperada. Escute o exemplo e tente de novo.')
  }

  const missing = targetWords.filter((w) => !transcriptWords.includes(w))
  if (missing.length > 0 && missing.length <= 6) {
    feedback.push(`⚠ Palavras faltando ou diferentes: ${missing.join(', ')}`)
  }

  if (fluency >= 85) {
    feedback.push(`✓ Ritmo natural (${Math.round(wpm)} palavras/min)`)
  } else if (wpm < 110) {
    feedback.push(
      `ℹ Tente falar com um pouco mais de fluidez (${Math.round(wpm)} WPM, ideal: 110-160)`
    )
  } else {
    feedback.push(
      `ℹ Tente reduzir o ritmo (${Math.round(wpm)} WPM, ideal: 110-160)`
    )
  }

  return { accuracy, pronunciation, fluency, feedback }
}
