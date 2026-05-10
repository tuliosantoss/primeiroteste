import React from 'react'
import Card from '@/components/Card'
import { LearningProgress } from '@/types'

interface ProgressCardProps {
  progress: LearningProgress
}

const ProgressCard: React.FC<ProgressCardProps> = ({ progress }) => {
  const progressPercentage = (progress.weeklyProgress / progress.weeklyGoal) * 100

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Level and XP */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Level</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{progress.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
            <p className="text-3xl font-bold text-primary-600">{progress.xp.toLocaleString()}</p>
          </div>
        </div>

        {/* Weekly Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weekly Goal</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {progress.weeklyProgress} / {progress.weeklyGoal} minutes
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <p className="text-2xl font-bold text-primary-600">{progress.currentStreak}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Current Streak</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <p className="text-2xl font-bold text-secondary-600">{progress.longestStreak}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Best Streak</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <p className="text-2xl font-bold text-amber-600">{progress.totalMinutesStudied}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Minutes</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProgressCard
