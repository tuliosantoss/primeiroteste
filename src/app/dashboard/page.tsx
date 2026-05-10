'use client'

import React, { useEffect } from 'react'
import Layout from '@/components/Layout'
import ProgressCard from '@/components/Dashboard/ProgressCard'
import ModuleCard from '@/components/Dashboard/ModuleCard'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { useLearningStore } from '@/store/useLearningStore'
import { LearningProgress, Achievement } from '@/types'
import { Calendar, Flame, Target, Trophy } from 'lucide-react'

const DashboardPage = () => {
  const { user } = useAuthStore()
  const { progress } = useLearningStore()

  // Mock data - in real app would fetch from API
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
      {
        id: '2',
        title: 'Speaking Master',
        description: 'Complete 50 speaking exercises',
        icon: '🎤',
        unlockedAt: new Date(),
        category: 'challenge',
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
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Keep up the momentum and continue your English learning journey
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
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

        {/* Modules Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Learning Modules</h2>
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

        {/* Recent Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockProgress.achievements.map((achievement) => (
              <Card key={achievement.id} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{achievement.icon}</div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{achievement.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Daily Challenge */}
        <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800 border border-primary-200 dark:border-primary-800">
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Today's Challenge</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Complete a speaking exercise and earn 50 XP bonus
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="primary" className="flex-1">
                Start Challenge
              </Button>
              <Button variant="outline" className="flex-1">
                Skip
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default DashboardPage
