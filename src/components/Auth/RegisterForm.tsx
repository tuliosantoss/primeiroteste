'use client'

import React, { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { Mail, Lock, User, UserCheck } from 'lucide-react'
import { UserRole } from '@/types'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const { registerUser, isLoading, error, clearError } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('As senhas não coincidem')
      return
    }

    try {
      await registerUser(email, password, name, role)
      onSuccess?.()
    } catch (err) {
      // erro já está no store
    }
  }

  const roles: { value: UserRole; label: string; icon: string; description: string }[] = [
    {
      value: 'student',
      label: 'Aluno',
      icon: '📚',
      description: 'Aprender inglês',
    },
    {
      value: 'teacher',
      label: 'Professor',
      icon: '👨‍🏫',
      description: 'Ensinar e criar conteúdo',
    },
    {
      value: 'admin',
      label: 'Administrador',
      icon: '🔐',
      description: 'Gerenciar plataforma',
    },
  ]

  return (
    <Card className="p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cadastro</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nome Completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearError()
              }}
              placeholder="Seu Nome"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
          </div>
        </div>

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

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Conta
          </label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                disabled={isLoading}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  role === r.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-300 dark:border-dark-600 hover:border-primary-400'
                }`}
              >
                <p className="text-2xl mb-1">{r.icon}</p>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">{r.label}</p>
              </button>
            ))}
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

        {/* Confirmar Senha */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Confirmar Senha
          </label>
          <div className="relative">
            <UserCheck className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                clearError()
              }}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Cadastrar
        </Button>
      </form>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
        Já tem conta?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
        >
          Faça login
        </button>
      </p>
    </Card>
  )
}

export default RegisterForm
