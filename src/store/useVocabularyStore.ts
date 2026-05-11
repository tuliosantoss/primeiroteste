import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WordStatus = 'new' | 'saved' | 'learning' | 'known'

export interface DailyStudy {
  date: string
  wordsStudied: number
}

interface VocabularyState {
  wordStatus: Record<string, WordStatus>
  studyHistory: DailyStudy[]
  totalInteractions: number
  customWords: Array<{
    id: string
    word: string
    pronunciation: string
    meaning: string
    example: string
    category: string
    difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
    partOfSpeech: string
  }>

  setWordStatus: (wordId: string, status: WordStatus) => void
  removeWord: (wordId: string) => void
  recordStudy: () => void
  addCustomWord: (word: VocabularyState['customWords'][0]) => void
  removeCustomWord: (wordId: string) => void

  resetWordStatus: () => void
  resetStats: () => void
  resetCustomWords: () => void
  resetAll: () => void
}

const todayKey = () => new Date().toISOString().split('T')[0]

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      wordStatus: {},
      studyHistory: [],
      totalInteractions: 0,
      customWords: [],

      setWordStatus: (wordId, status) => {
        const state = get()
        const newStatus = { ...state.wordStatus }
        if (status === 'new') {
          delete newStatus[wordId]
        } else {
          newStatus[wordId] = status
        }
        set({
          wordStatus: newStatus,
          totalInteractions: state.totalInteractions + 1,
        })
        get().recordStudy()
      },

      removeWord: (wordId) => {
        const state = get()
        const newStatus = { ...state.wordStatus }
        delete newStatus[wordId]
        set({ wordStatus: newStatus })
      },

      recordStudy: () => {
        const today = todayKey()
        const state = get()
        const history = [...state.studyHistory]
        const idx = history.findIndex((d) => d.date === today)
        if (idx >= 0) {
          history[idx] = { ...history[idx], wordsStudied: history[idx].wordsStudied + 1 }
        } else {
          history.push({ date: today, wordsStudied: 1 })
        }
        // Keep last 30 days
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - 30)
        const filtered = history.filter((d) => new Date(d.date) >= cutoff)
        set({ studyHistory: filtered })
      },

      addCustomWord: (word) => {
        set((state) => ({ customWords: [...state.customWords, word] }))
      },

      removeCustomWord: (wordId) => {
        set((state) => ({
          customWords: state.customWords.filter((w) => w.id !== wordId),
        }))
        get().removeWord(wordId)
      },

      resetWordStatus: () => set({ wordStatus: {} }),
      resetStats: () => set({ studyHistory: [], totalInteractions: 0 }),
      resetCustomWords: () => set({ customWords: [] }),
      resetAll: () =>
        set({
          wordStatus: {},
          studyHistory: [],
          totalInteractions: 0,
          customWords: [],
        }),
    }),
    {
      name: 'vocabulary-storage',
    }
  )
)

export function getStreakFromHistory(history: DailyStudy[]): number {
  if (history.length === 0) return 0
  const sorted = [...history].sort((a, b) => (a.date < b.date ? 1 : -1))
  let streak = 0
  let current = new Date()
  current.setHours(0, 0, 0, 0)

  for (const entry of sorted) {
    const entryDate = new Date(entry.date)
    entryDate.setHours(0, 0, 0, 0)
    const diff = Math.round(
      (current.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diff === streak) {
      streak++
      current.setDate(current.getDate() - 1)
    } else if (diff > streak) {
      break
    }
  }
  return streak
}
