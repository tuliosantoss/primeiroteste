'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import FlashcardView from '@/components/Flashcards/FlashcardView'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Flashcard } from '@/types'
import { BookOpen, Plus } from 'lucide-react'

const FlashcardsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isSessionActive, setIsSessionActive] = useState(false)

  const categories = [
    { id: 'all', name: 'All Cards', count: 285 },
    { id: 'business', name: 'Business English', count: 45 },
    { id: 'casual', name: 'Casual Conversation', count: 52 },
    { id: 'academic', name: 'Academic English', count: 68 },
    { id: 'phrasal-verbs', name: 'Phrasal Verbs', count: 73 },
    { id: 'idioms', name: 'Idioms & Expressions', count: 47 },
  ]

  const mockFlashcards: Flashcard[] = [
    {
      id: '1',
      front: 'To procrastinate',
      back: 'To delay or postpone something intentionally',
      category: 'academic',
      difficulty: 'medium',
      reviewCount: 5,
      correctCount: 3,
      ease: 1.5,
      nextReviewDate: new Date(Date.now() + 86400000),
    },
    {
      id: '2',
      front: 'Paradigm shift',
      back: 'A fundamental change in approach or underlying assumptions',
      category: 'business',
      difficulty: 'hard',
      reviewCount: 3,
      correctCount: 1,
      ease: 1.3,
      nextReviewDate: new Date(Date.now() + 172800000),
    },
    {
      id: '3',
      front: 'To figure something out',
      back: 'To understand or solve a problem',
      category: 'casual',
      difficulty: 'easy',
      reviewCount: 8,
      correctCount: 7,
      ease: 2.0,
      nextReviewDate: new Date(Date.now() + 604800000),
    },
    {
      id: '4',
      front: 'Raining cats and dogs',
      back: 'Raining heavily/hard',
      category: 'idioms',
      difficulty: 'easy',
      reviewCount: 6,
      correctCount: 6,
      ease: 2.0,
      nextReviewDate: new Date(Date.now() + 604800000),
    },
  ]

  const handleSessionComplete = (results: { cardId: string; correct: boolean }[]) => {
    setIsSessionActive(false)
    // Would save results to database
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Flashcards 🎨</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Master vocabulary and phrases with spaced repetition
          </p>
        </div>

        {!isSessionActive ? (
          <>
            {/* Category Selection */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select a category</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    hoverable
                    className={`p-6 cursor-pointer transition-all ${
                      selectedCategory === category.id
                        ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-dark-700'
                        : ''
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <p className="font-bold text-gray-900 dark:text-white mb-2">{category.name}</p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {category.count}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">cards</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">Cards to Review</p>
                <p className="text-3xl font-bold text-primary-600 mt-2">12</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">Learning</p>
                <p className="text-3xl font-bold text-secondary-600 mt-2">28</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">Review</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">45</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">Learned</p>
                <p className="text-3xl font-bold text-green-600 mt-2">200</p>
              </Card>
            </div>

            {/* Flashcard List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">All Flashcards</p>
                <Button variant="primary" size="sm" icon={<Plus size={18} />}>
                  Create Card
                </Button>
              </div>

              <div className="space-y-3">
                {mockFlashcards.map((card) => (
                  <Card key={card.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white">{card.front}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{card.back}</p>
                      </div>

                      <div className="flex items-center gap-4 ml-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Accuracy</p>
                          <p className="text-lg font-bold text-green-600">
                            {Math.round((card.correctCount / card.reviewCount) * 100)}%
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Reviews</p>
                          <p className="text-lg font-bold text-primary-600">{card.reviewCount}</p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            card.difficulty === 'easy'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : card.difficulty === 'medium'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                          }`}
                        >
                          {card.difficulty}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Start Session Button */}
            <Card className="p-8 bg-gradient-to-r from-primary-500 to-secondary-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ready to Study?</h3>
                  <p className="text-primary-100">Start a flashcard session and boost your vocabulary</p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsSessionActive(true)}
                  className="bg-white text-primary-600 hover:bg-gray-100"
                >
                  Start Session
                </Button>
              </div>
            </Card>
          </>
        ) : (
          <>
            {/* Session Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Study Session</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsSessionActive(false)}
              >
                Exit Session
              </Button>
            </div>

            {/* Flashcard Session */}
            <FlashcardView flashcards={mockFlashcards} onComplete={handleSessionComplete} />
          </>
        )}

        {/* Tips */}
        {!isSessionActive && (
          <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={28} className="text-primary-600 dark:text-primary-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Spaced Repetition Tips</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-2">📚 Learn First</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Start with new cards and review them after 1 day, 3 days, then 1 week.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-2">🔄 Review Regularly</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Review cards based on difficulty. Easy cards less often, hard cards more often.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-2">⏰ Consistency</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Study 15-20 minutes daily for best results. Small consistent efforts compound.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  )
}

export default FlashcardsPage
