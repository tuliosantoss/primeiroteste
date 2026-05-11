'use client'

import React, { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { Mail, Lock } from 'lucide-react'

interface LoginFormProps {
  onSuccess?: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('student@test.com')
  const [password, setPassword] = useState('password123')
  const { loginUser, isLoading, error, clearError } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginUser(email, password)
      onSuccess?.()
    } catch (err) {
      // erro já está no store
    }
  }

  return (
    <Card className="p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Login</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearError()
              }}
              placeholder="seu@email.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Senha */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearError()
              }}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 p-3 rounded">
          <p className="font-semibold mb-1">Demo - Use uma dessas contas:</p>
          <p>📚 Aluno: student@test.com</p>
          <p>👨‍🏫 Professor: teacher@test.com</p>
          <p>🔐 Admin: admin@test.com</p>
          <p>Senha: password123</p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Entrar
        </Button>
      </form>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
        Não tem conta?{' '}
        <button className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          Cadastre-se
        </button>
      </p>
    </Card>
  )
}

export default LoginForm
