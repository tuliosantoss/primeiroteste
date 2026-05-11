'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import LoginForm from '@/components/Auth/LoginForm'
import RegisterForm from '@/components/Auth/RegisterForm'

type AuthMode = 'login' | 'register'

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()

  React.useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard')
    }
  }, [isLoggedIn, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary-200 dark:bg-secondary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-white">EC</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">EnglishCanvas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Aprenda inglês de forma inteligente</p>
        </div>

        {/* Auth Forms */}
        {mode === 'login' ? (
          <LoginForm
            onSuccess={() => router.push('/dashboard')}
          />
        ) : (
          <RegisterForm
            onSuccess={() => router.push('/dashboard')}
            onSwitchToLogin={() => setMode('login')}
          />
        )}

        {/* Toggle mode */}
        {mode === 'login' && (
          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Não tem conta ainda?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
              >
                Crie uma agora
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthPage
