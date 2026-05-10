import { create } from 'zustand'
import { User } from '@/types'

interface AuthStore {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  setUser: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUserProfile: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,

  setUser: (user) =>
    set({
      user,
      isLoggedIn: true,
    }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  updateUserProfile: (updates) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            ...updates,
          }
        : null,
    })),
}))
