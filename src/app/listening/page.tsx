'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Play, Pause, Volume2 } from 'lucide-react'

const ListeningPage = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const exercises = [
    {
      id: '1',
      title: 'Restaurant Dialogue',
      duration: 120,
      difficulty: 'beginner',
      description: 'Order food at a restaurant',
    },
    {
      id: '2',
      title: 'Interview Simulation',
      duration: 180,
      difficulty: 'intermediate',
      description: 'Practice for job interviews',
    },
    {
      id: '3',
      title: 'Podcast Discussion',
      duration: 240,
      difficulty: 'advanced',
      description: 'Understand complex discussions',
    },
  ]

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Listening Practice 👂</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Improve your comprehension with authentic audio materials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{exercise.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900' :
                  exercise.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900' :
                  'bg-rose-100 text-rose-800 dark:bg-rose-900'
                }`}>
                  {exercise.difficulty}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{exercise.description}</p>

              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 mb-6">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
              </div>

              <Button variant="primary" className="w-full" icon={<Play size={18} />}>
                Start Listening
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🎧 Active Listening Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Don't Look at Script First</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Challenge yourself to understand without reading the transcript first.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Take Notes</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Write down key words and phrases as you listen. This improves focus and retention.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Listen Multiple Times</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">First for general understanding, then for details, then to catch words you missed.</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default ListeningPage
