import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null

  // Auth actions
  setUser: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateUserProfile: (updates: Partial<User>) => void

  // Registration/Login
  registerUser: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  loginUser: (email: string, password: string) => Promise<void>
  clearError: () => void
}

// Mock database (em produção, seria um backend real)
const mockDatabase: Record<string, User> = {
  'student@test.com': {
    id: '1',
    email: 'student@test.com',
    name: 'João Silva',
    password: 'password123', // em produção seria hash
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
    (set) => ({
      user: null,
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

      updateUserProfile: (updates) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...updates,
              }
            : null,
        })),

      registerUser: async (email: string, password: string, name: string, role: UserRole) => {
        set({ isLoading: true, error: null })

        try {
          // Simular delay de rede
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Validações
          if (!email || !password || !name) {
            throw new Error('Todos os campos são obrigatórios')
          }

          if (password.length < 6) {
            throw new Error('Senha deve ter pelo menos 6 caracteres')
          }

          if (mockDatabase[email]) {
            throw new Error('Este email já está cadastrado')
          }

          // Criar novo usuário
          const newUser: User = {
            id: Date.now().toString(),
            email,
            name,
            password, // em produção seria hash
            role,
            level: 'A1',
            joinedAt: new Date(),
            darkMode: false,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          }

          mockDatabase[email] = newUser
          set({ user: newUser, isLoggedIn: true, isLoading: false })
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : 'Erro ao cadastrar',
          })
          throw err
        }
      },

      loginUser: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          // Simular delay de rede
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Validações
          if (!email || !password) {
            throw new Error('Email e senha são obrigatórios')
          }

          // Buscar usuário
          const user = mockDatabase[email]
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
      name: 'auth-storage', // nome da chave no localStorage
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
)
