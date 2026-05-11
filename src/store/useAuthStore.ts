import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  users: Record<string, User>
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null

  setUser: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateUserProfile: (updates: Partial<User>) => void

  registerUser: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  loginUser: (email: string, password: string) => Promise<void>
  clearError: () => void

  adminUpdateUser: (email: string, updates: Partial<User>) => void
  adminDeleteUser: (email: string) => void
  adminCreateUser: (data: { email: string; password: string; name: string; role: UserRole; level?: User['level'] }) => void
}

const defaultUsers: Record<string, User> = {
  'student@test.com': {
    id: '1',
    email: 'student@test.com',
    name: 'João Silva',
    password: 'password123',
    role: 'student',
    level: 'B1',
    joinedAt: new Date('2024-01-15'),
    darkMode: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
    country: 'Brasil',
    nativeLanguage: 'Português',
  },
  'teacher@test.com': {
    id: '2',
    email: 'teacher@test.com',
    name: 'Maria Santos',
    password: 'password123',
    role: 'teacher',
    level: 'C2',
    joinedAt: new Date('2023-06-20'),
    darkMode: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher',
    country: 'Brasil',
    nativeLanguage: 'Português',
  },
  'admin@test.com': {
    id: '3',
    email: 'admin@test.com',
    name: 'Admin System',
    password: 'password123',
    role: 'admin',
    level: 'C2',
    joinedAt: new Date('2023-01-01'),
    darkMode: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: defaultUsers,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({
          user,
          isLoggedIn: true,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
          error: null,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      updateUserProfile: (updates) => {
        const state = get()
        if (!state.user) return

        const updatedUser = { ...state.user, ...updates }
        const updatedUsers = {
          ...state.users,
          [state.user.email]: updatedUser,
        }

        set({ user: updatedUser, users: updatedUsers })
      },

      registerUser: async (email: string, password: string, name: string, role: UserRole) => {
        set({ isLoading: true, error: null })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          if (!email || !password || !name) {
            throw new Error('Todos os campos são obrigatórios')
          }

          if (password.length < 6) {
            throw new Error('Senha deve ter pelo menos 6 caracteres')
          }

          const state = get()
          if (state.users[email]) {
            throw new Error('Este email já está cadastrado')
          }

          const newUser: User = {
            id: Date.now().toString(),
            email,
            name,
            password,
            role,
            level: 'A1',
            joinedAt: new Date(),
            darkMode: false,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          }

          set({
            user: newUser,
            users: { ...state.users, [email]: newUser },
            isLoggedIn: true,
            isLoading: false,
          })
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : 'Erro ao cadastrar',
          })
          throw err
        }
      },

      adminUpdateUser: (email, updates) => {
        const state = get()
        const target = state.users[email]
        if (!target) return

        const updatedUser = { ...target, ...updates }
        const updatedUsers = { ...state.users, [email]: updatedUser }

        const isCurrentUser = state.user?.email === email
        set({
          users: updatedUsers,
          user: isCurrentUser ? updatedUser : state.user,
        })
      },

      adminDeleteUser: (email) => {
        const state = get()
        if (!state.users[email]) return
        if (state.user?.email === email) return

        const updatedUsers = { ...state.users }
        delete updatedUsers[email]
        set({ users: updatedUsers })
      },

      adminCreateUser: ({ email, password, name, role, level }) => {
        const state = get()
        if (state.users[email]) {
          throw new Error('Este email já está cadastrado')
        }

        const newUser: User = {
          id: Date.now().toString(),
          email,
          name,
          password,
          role,
          level: level || 'A1',
          joinedAt: new Date(),
          darkMode: false,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        }

        set({ users: { ...state.users, [email]: newUser } })
      },

      loginUser: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          if (!email || !password) {
            throw new Error('Email e senha são obrigatórios')
          }

          const state = get()
          const user = state.users[email]
          if (!user || user.password !== password) {
            throw new Error('Email ou senha inválidos')
          }

          set({ user, isLoggedIn: true, isLoading: false })
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : 'Erro ao fazer login',
          })
          throw err
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        users: state.users,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
)
