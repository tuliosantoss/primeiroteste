'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import SpeakingExerciseCard from '@/components/Speaking/SpeakingExerciseCard'
import Card from '@/components/Card'
import { SpeakingExercise, SpeakingResult } from '@/types'

const SpeakingPage = () => {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [results, setResults] = useState<SpeakingResult | null>(null)

  const exercises: SpeakingExercise[] = [
    {
      id: '1',
      title: 'Phone Conversation',
      description: 'Practice making a phone call in English',
      targetPhrase: "Hello, I'd like to schedule an appointment, please.",
      difficulty: 'beginner',
      audioUrl: 'https://example.com/audio.mp3',
      instructions:
        'Listen to the phrase, then record your voice saying it. Try to match the pronunciation and intonation as closely as possible.',
    },
    {
      id: '2',
      title: 'Business Introduction',
      description: 'Learn to introduce yourself professionally',
      targetPhrase: 'My name is John Smith, and I work as a software engineer at Tech Company.',
      difficulty: 'intermediate',
      audioUrl: 'https://example.com/audio2.mp3',
      instructions:
        'Introduce yourself as if you are in a business meeting. Focus on clarity and confidence.',
    },
    {
      id: '3',
      title: 'Complex Explanation',
      description: 'Explain complex ideas in English',
      targetPhrase:
        'The primary advantage of this approach is that it allows for greater flexibility and scalability while maintaining compatibility.',
      difficulty: 'advanced',
      instructions: 'Explain the concept clearly and use appropriate vocabulary. Pay attention to your pace and intonation.',
    },
  ]

  const handleSubmit = (audioData: Blob) => {
    // Mock analysis
    const mockResult: SpeakingResult = {
      exerciseId: exercises[currentExercise].id,
      userAudio: URL.createObjectURL(audioData),
      transcription: 'Hello I would like to schedule an appointment please',
      accuracy: 85,
      pronunciation: 78,
      fluency: 82,
      feedback: [
        '✓ Good pronunciation of "appointment"',
        '⚠ Try to slow down slightly for better clarity',
        '✓ Excellent intonation at the end of the sentence',
      ],
    }

    setResults(mockResult)
  }

  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setResults(null)
    }
  }

  const handlePreviousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      setResults(null)
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Speaking Practice 🎤</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Improve your pronunciation, fluency, and confidence in English
          </p>
        </div>

        {/* Exercise Progress */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Exercise {currentExercise + 1} of {exercises.length}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousExercise}
              disabled={currentExercise === 0}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={handleNextExercise}
              disabled={currentExercise === exercises.length - 1 || !results}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exercise */}
          <div className="lg:col-span-2">
            <SpeakingExerciseCard
              exercise={exercises[currentExercise]}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Scores */}
                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Analysis Results</h3>

                  <div className="space-y-4">
                    <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                        {Math.round((results.accuracy + results.pronunciation + results.fluency) / 3)}%
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Accuracy
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{results.accuracy}%</p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${results.accuracy}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Pronunciation
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{results.pronunciation}%</p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${results.pronunciation}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Fluency
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{results.fluency}%</p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${results.fluency}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Feedback */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Feedback</h3>
                  <div className="space-y-3">
                    {results.feedback.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Transcription */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Transcription</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    "{results.transcription}"
                  </p>
                </Card>
              </>
            ) : (
              <Card className="p-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  📝 Complete the exercise above and submit your recording to see detailed feedback on your
                  pronunciation, accuracy, and fluency.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">💡 Tips for Better Speaking</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Speak Slowly</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Take your time and enunciate each word clearly. Native speakers value clarity over speed.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Practice Regularly</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dedicate 20-30 minutes daily to speaking practice. Consistency is key to improvement.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Listen First</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Always listen to the native speaker example before recording. This helps you internalize the correct pronunciation.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default SpeakingPage
