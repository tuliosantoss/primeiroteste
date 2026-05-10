import React from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Link from 'next/link'

interface ModuleCardProps {
  title: string
  description: string
  icon: string
  href: string
  progress: number
  lessonsCompleted: number
  totalLessons: number
  color: 'primary' | 'secondary' | 'amber' | 'green' | 'rose'
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  href,
  progress,
  lessonsCompleted,
  totalLessons,
  color,
}) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    amber: 'from-amber-500 to-amber-600',
    green: 'from-green-500 to-green-600',
    rose: 'from-rose-500 to-rose-600',
  }

  return (
    <Card className="p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300" hoverable>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5`} />

      <div className="relative space-y-4">
        {/* Icon and Title */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl mb-2">{icon}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lessonsCompleted} / {totalLessons}
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${colorClasses[color]} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Button */}
        <Link href={href} className="block">
          <Button variant="primary" size="md" className="w-full">
            Continue Learning
          </Button>
        </Link>
      </div>
    </Card>
  )
}

export default ModuleCard
