'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import SpeakingExerciseCard from '@/components/Speaking/SpeakingExerciseCard'
import Card from '@/components/Card'
import { SpeakingExercise, SpeakingResult } from '@/types'
import { analyzeSpeaking } from '@/lib/speech'

const exercises: SpeakingExercise[] = [
  {
    id: '1',
    title: 'Greeting Someone',
    description: 'Practice basic greetings in English',
    targetPhrase: 'Good morning, how are you doing today?',
    difficulty: 'beginner',
    instructions: 'Greet someone in a friendly tone. Smile while you speak.',
  },
  {
    id: '2',
    title: 'Ordering at a Cafe',
    description: 'Place an order at a coffee shop',
    targetPhrase: "I'd like a large coffee with milk and one sugar, please.",
    difficulty: 'beginner',
    instructions: 'Be polite and clear when ordering. Use "please" at the end.',
  },
  {
    id: '3',
    title: 'Business Introduction',
    description: 'Introduce yourself professionally',
    targetPhrase: 'My name is John Smith, and I work as a software engineer.',
    difficulty: 'intermediate',
    instructions: 'Speak with confidence. Pronounce your name and job title clearly.',
  },
  {
    id: '4',
    title: 'Asking for Directions',
    description: 'Ask how to get somewhere',
    targetPhrase: 'Excuse me, could you tell me how to get to the nearest train station?',
    difficulty: 'intermediate',
    instructions: 'Speak politely. Stress key words like "train station".',
  },
  {
    id: '5',
    title: 'Phone Conversation',
    description: 'Make a professional phone call',
    targetPhrase: 'Hello, I would like to schedule an appointment for next week.',
    difficulty: 'intermediate',
    instructions: 'Speak clearly as if the other person cannot see you.',
  },
  {
    id: '6',
    title: 'Job Interview',
    description: 'Answer a common interview question',
    targetPhrase: 'I have over five years of experience in project management and team leadership.',
    difficulty: 'advanced',
    instructions: 'Project confidence. Pause briefly between phrases.',
  },
  {
    id: '7',
    title: 'Giving an Opinion',
    description: 'Express your view on a topic',
    targetPhrase: 'In my opinion, technology has both positive and negative effects on society.',
    difficulty: 'advanced',
    instructions: 'Speak thoughtfully. Emphasize "positive" and "negative".',
  },
  {
    id: '8',
    title: 'Complex Explanation',
    description: 'Explain a technical concept',
    targetPhrase: 'The main advantage of this approach is flexibility while maintaining compatibility.',
    difficulty: 'advanced',
    instructions: 'Take your time. Stress technical terms clearly.',
  },
]

const SpeakingPage = () => {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [results, setResults] = useState<SpeakingResult | null>(null)

  const handleSubmit = (transcript: string, durationMs: number) => {
    const exercise = exercises[currentExercise]
    const scores = analyzeSpeaking(transcript, exercise.targetPhrase, durationMs)

    setResults({
      exerciseId: exercise.id,
      userAudio: '',
      transcription: transcript,
      accuracy: scores.accuracy,
      pronunciation: scores.pronunciation,
      fluency: scores.fluency,
      feedback: scores.feedback,
    })
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

  const overall = results
    ? Math.round((results.accuracy + results.pronunciation + results.fluency) / 3)
    : 0

  const overallColor =
    overall >= 80
      ? 'text-green-600 dark:text-green-400'
      : overall >= 60
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400'

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Speaking Practice 🎤
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Pratique sua pronúncia com reconhecimento de voz em tempo real
          </p>
        </div>

        {/* Exercise Progress */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Exercício {currentExercise + 1} de {exercises.length}
            </p>
            <div className="flex gap-1 mt-2">
              {exercises.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-8 rounded-full transition-colors ${
                    idx === currentExercise
                      ? 'bg-primary-600'
                      : idx < currentExercise
                        ? 'bg-primary-300 dark:bg-primary-800'
                        : 'bg-gray-200 dark:bg-dark-700'
                  }`}
                />
              ))}
            </div>
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
              disabled={currentExercise === exercises.length - 1}
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
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Resultado da Análise
                  </h3>

                  <div className="space-y-4">
                    <div className="text-center p-4 bg-white dark:bg-dark-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Nota Geral</p>
                      <p className={`text-3xl font-bold mt-2 ${overallColor}`}>{overall}%</p>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Precisão
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {results.accuracy}%
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${results.accuracy}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Pronúncia
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {results.pronunciation}%
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${results.pronunciation}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Fluência
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {results.fluency}%
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
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
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Sua transcrição
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    "{results.transcription}"
                  </p>
                </Card>
              </>
            ) : (
              <Card className="p-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  📝 Clique em <strong>Listen</strong> para ouvir a frase, depois em{' '}
                  <strong>Start Recording</strong> para gravar sua voz. A análise compara o que você
                  falou com a frase-alvo.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Tips */}
        <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            💡 Dicas para falar melhor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Fale com calma</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pronuncie cada palavra claramente. Falantes nativos valorizam clareza mais que
                velocidade.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Pratique todo dia</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dedique 20-30 minutos por dia. Consistência é a chave para evolução.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Ouça primeiro</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sempre ouça o exemplo antes de gravar. Isso ajuda a internalizar a pronúncia
                correta.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default SpeakingPage
