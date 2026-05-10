'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import WritingEditor from '@/components/Writing/WritingEditor'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { WritingExercise } from '@/types'
import { Award, BookOpen } from 'lucide-react'

const WritingPage = () => {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [submittedContent, setSubmittedContent] = useState<string | null>(null)

  const exercises: WritingExercise[] = [
    {
      id: '1',
      title: 'Personal Introduction',
      topic: 'About Yourself',
      prompt:
        'Write a paragraph about yourself, including your name, where you come from, your interests, and your goals for learning English.',
      difficulty: 'beginner',
      minWords: 80,
      maxWords: 150,
    },
    {
      id: '2',
      title: 'Formal Email',
      topic: 'Professional Communication',
      prompt:
        'Write a formal email to your manager requesting a day off for a doctor\'s appointment. Include a brief explanation and suggest an alternative date if needed.',
      difficulty: 'intermediate',
      minWords: 100,
      maxWords: 200,
    },
    {
      id: '3',
      title: 'Opinion Essay',
      topic: 'Advanced Writing',
      prompt:
        'Write an essay about the impact of social media on modern society. Include your opinion, supporting arguments, and examples. Discuss both positive and negative effects.',
      difficulty: 'advanced',
      minWords: 250,
      maxWords: 400,
    },
  ]

  const handleSubmit = (content: string) => {
    setSubmittedContent(content)
  }

  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setSubmittedContent(null)
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Writing Practice ✍️</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Improve your grammar, vocabulary, and written expression
          </p>
        </div>

        {/* Exercise Navigation */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Exercise {currentExercise + 1} of {exercises.length}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (currentExercise > 0) {
                  setCurrentExercise(currentExercise - 1)
                  setSubmittedContent(null)
                }
              }}
              disabled={currentExercise === 0}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={handleNextExercise}
              disabled={currentExercise === exercises.length - 1 || !submittedContent}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Main Content */}
        <WritingEditor exercise={exercises[currentExercise]} onSubmit={handleSubmit} />

        {/* Submitted Content */}
        {submittedContent && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Essay</h3>
                <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                  {submittedContent}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-green-50 dark:bg-green-900">
                <div className="flex items-center gap-3 mb-4">
                  <Award size={24} className="text-green-600 dark:text-green-400" />
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Submitted!</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Your essay has been submitted. You'll receive detailed feedback soon.
                </p>
                <Button variant="primary" className="w-full">
                  View Feedback
                </Button>
              </Card>

              <Card className="p-6">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Word Count</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {submittedContent.trim().split(/\s+/).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reading Time</p>
                    <p className="text-2xl font-bold text-secondary-600">
                      ~{Math.round(submittedContent.trim().split(/\s+/).length / 200)} min
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Writing Tips */}
        <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={28} className="text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Writing Tips</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✓ Do This</h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Use varied sentence structures</li>
                <li>• Check grammar before submitting</li>
                <li>• Use transition words and phrases</li>
                <li>• Read aloud to catch errors</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✗ Avoid This</h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Repeating the same words</li>
                <li>• Writing very long sentences</li>
                <li>• Using informal language in formal essays</li>
                <li>• Ignoring punctuation rules</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default WritingPage
