'use client'

import React from 'react'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import ProgressCard from '@/components/Dashboard/ProgressCard'
import ModuleCard from '@/components/Dashboard/ModuleCard'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { LearningProgress } from '@/types'
import { Calendar, Flame, Target, Trophy, BookOpen } from 'lucide-react'

const StudentDashboard = () => {
  const { user } = useAuthStore()

  const mockProgress: LearningProgress = {
    userId: user?.id || '',
    totalMinutesStudied: 1245,
    currentStreak: 7,
    longestStreak: 23,
    lastStudyDate: new Date(),
    weeklyGoal: 300,
    weeklyProgress: 245,
    level: 'B1',
    xp: 8540,
    achievements: [
      {
        id: '1',
        title: '7-Day Streak',
        description: 'Study for 7 consecutive days',
        icon: '🔥',
        unlockedAt: new Date(),
        category: 'streak',
      },
    ],
  }

  const modules = [
    {
      title: 'Speaking',
      description: 'Perfect your pronunciation and fluency',
      icon: '🎤',
      href: '/speaking',
      progress: 65,
      lessonsCompleted: 13,
      totalLessons: 20,
      color: 'primary' as const,
    },
    {
      title: 'Listening',
      description: 'Improve your comprehension skills',
      icon: '👂',
      href: '/listening',
      progress: 45,
      lessonsCompleted: 9,
      totalLessons: 20,
      color: 'secondary' as const,
    },
    {
      title: 'Reading',
      description: 'Expand your reading ability',
      icon: '📖',
      href: '/reading',
      progress: 78,
      lessonsCompleted: 15,
      totalLessons: 20,
      color: 'amber' as const,
    },
    {
      title: 'Writing',
      description: 'Develop your writing skills',
      icon: '✍️',
      href: '/writing',
      progress: 52,
      lessonsCompleted: 10,
      totalLessons: 20,
      color: 'green' as const,
    },
    {
      title: 'Vocabulary',
      description: 'Build your word knowledge',
      icon: '📚',
      href: '/vocabulary',
      progress: 88,
      lessonsCompleted: 88,
      totalLessons: 100,
      color: 'rose' as const,
    },
    {
      title: 'Flashcards',
      description: 'Master words and phrases',
      icon: '🎨',
      href: '/flashcards',
      progress: 35,
      lessonsCompleted: 35,
      totalLessons: 100,
      color: 'primary' as const,
    },
  ]

  return (
    <ProtectedRoute requiredRole="student">
      <Layout>
        <div className="space-y-8">
          {/* Welcome */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Bem-vindo de volta, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Continue sua jornada de aprendizado em inglês
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sequência Atual</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {mockProgress.currentStreak}
                  </p>
                </div>
                <Flame size={32} className="text-orange-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total de XP</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {(mockProgress.xp / 1000).toFixed(1)}K
                  </p>
                </div>
                <Target size={32} className="text-primary-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Conquistas</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {mockProgress.achievements.length}
                  </p>
                </div>
                <Trophy size={32} className="text-amber-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Neste Mês</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {Math.round(mockProgress.totalMinutesStudied / 60)}h
                  </p>
                </div>
                <Calendar size={32} className="text-green-500" />
              </div>
            </Card>
          </div>

          {/* Progress Card */}
          <ProgressCard progress={mockProgress} />

          {/* Modules */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Módulos de Aprendizado
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <ModuleCard
                  key={module.href}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  href={module.href}
                  progress={module.progress}
                  lessonsCompleted={module.lessonsCompleted}
                  totalLessons={module.totalLessons}
                  color={module.color}
                />
              ))}
            </div>
          </div>

          {/* Daily Challenge */}
          <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800">
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Desafio do Dia
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete um exercício de fala e ganhe 50 XP bônus
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">
                  Iniciar Desafio
                </Button>
                <Button variant="outline" className="flex-1">
                  Pular
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

export default StudentDashboard
