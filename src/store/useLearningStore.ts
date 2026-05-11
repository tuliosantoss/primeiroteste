import { create } from 'zustand'
import { LearningProgress, DailyActivity } from '@/types'

interface LearningStore {
  progress: LearningProgress | null
  dailyActivities: DailyActivity[]
  selectedModule: string | null

  setProgress: (progress: LearningProgress) => void
  addDailyActivity: (activity: DailyActivity) => void
  updateStreak: (newStreak: number) => void
  addXp: (xp: number) => void
  setSelectedModule: (module: string) => void
}

export const useLearningStore = create<LearningStore>((set) => ({
  progress: null,
  dailyActivities: [],
  selectedModule: null,

  setProgress: (progress) => set({ progress }),

  addDailyActivity: (activity) =>
    set((state) => ({
      dailyActivities: [...state.dailyActivities, activity],
    })),

  updateStreak: (newStreak) =>
    set((state) => ({
      progress: state.progress
        ? {
            ...state.progress,
            currentStreak: newStreak,
          }
        : null,
    })),

  addXp: (xp) =>
    set((state) => ({
      progress: state.progress
        ? {
            ...state.progress,
            xp: state.progress.xp + xp,
          }
        : null,
    })),

  setSelectedModule: (module) => set({ selectedModule: module }),
}))
