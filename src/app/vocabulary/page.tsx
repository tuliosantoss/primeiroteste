'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { BookOpen, Search, Volume2 } from 'lucide-react'

const VocabularyPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'daily', name: 'Daily Life', count: 45, color: 'primary' },
    { id: 'business', name: 'Business', count: 52, color: 'secondary' },
    { id: 'nature', name: 'Nature', count: 38, color: 'green' },
    { id: 'emotions', name: 'Emotions', count: 41, color: 'rose' },
    { id: 'tech', name: 'Technology', count: 56, color: 'blue' },
    { id: 'culture', name: 'Culture', count: 34, color: 'purple' },
  ]

  const words = [
    { word: 'Serendipity', pronunciation: '/ˌserənˈdɪpəti/', meaning: 'Finding something valuable by chance', example: 'It was pure serendipity that we met.' },
    { word: 'Eloquent', pronunciation: '/ˈeləkwənt/', meaning: 'Fluent, persuasive, and expressive in speaking', example: 'Her eloquent speech inspired the audience.' },
    { word: 'Ephemeral', pronunciation: '/ɪˈfem(ə)rəl/', meaning: 'Lasting for a very short time', example: 'The beauty of cherry blossoms is ephemeral.' },
    { word: 'Ineffable', pronunciation: '/ɪnˈefəbəl/', meaning: 'Too great to be expressed in words', example: 'The experience was ineffable.' },
    { word: 'Nostalgia', pronunciation: '/nɑːˈstældʒə/', meaning: 'Sentimental longing for the past', example: 'Hearing that song filled me with nostalgia.' },
  ]

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Vocabulary Builder 📚</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Expand your word knowledge with categorized vocabulary and examples
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                hoverable
                className="p-6 cursor-pointer transition-all"
              >
                <p className="font-bold text-gray-900 dark:text-white mb-2">{category.name}</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {category.count}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">words</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Word List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Featured Words</h2>
          <div className="space-y-4">
            {words.map((word, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{word.word}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Volume2 size={16} />}
                        onClick={() => {
                          const utterance = new SpeechSynthesisUtterance(word.word)
                          utterance.lang = 'en-US'
                          window.speechSynthesis.speak(utterance)
                        }}
                      />
                    </div>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-mono mb-2">
                      {word.pronunciation}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                      {word.meaning}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      "{word.example}"
                    </p>
                  </div>

                  <Button variant="primary" size="sm">
                    Save
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Tips */}
        <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={28} className="text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Vocabulary Learning Tips</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Learn in Context</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Learn words through sentences and examples, not just isolated definitions.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Use Spaced Repetition</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Review new words after 1 day, 3 days, 1 week, and 1 month for maximum retention.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Practice Active Recall</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Test yourself before looking at the definition to strengthen memory.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default VocabularyPage
