'use client'

import React from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import Card from '@/components/Card'
import { LogOut, Settings, Edit } from 'lucide-react'
import Button from './Button'

const UserProfile: React.FC = () => {
  const { user, logout } = useAuthStore()

  if (!user) return null

  const roleInfo = {
    student: {
      icon: '📚',
      label: 'Aluno',
      color: 'text-blue-600 dark:text-blue-400',
    },
    teacher: {
      icon: '👨‍🏫',
      label: 'Professor',
      color: 'text-green-600 dark:text-green-400',
    },
    admin: {
      icon: '🔐',
      label: 'Administrador',
      color: 'text-purple-600 dark:text-purple-400',
    },
  }

  const role = roleInfo[user.role]

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            <div className={`text-sm font-semibold ${role.color} flex items-center gap-1 mt-1`}>
              <span>{role.icon}</span>
              {role.label}
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 mb-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Nível de Inglês:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{user.level}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Membro desde:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {new Date(user.joinedAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
        {user.country && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">País:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{user.country}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" icon={<Edit size={16} />}>
          Editar Perfil
        </Button>
        <Button variant="ghost" size="sm" className="flex-1" icon={<Settings size={16} />}>
          Configurações
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={<LogOut size={16} />}
          onClick={() => {
            logout()
            window.location.href = '/auth'
          }}
        >
          Sair
        </Button>
      </div>
    </Card>
  )
}

export default UserProfile
