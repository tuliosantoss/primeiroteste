import React, { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Volume2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { Flashcard } from '@/types'

interface FlashcardViewProps {
  flashcards: Flashcard[]
  onComplete: (results: { cardId: string; correct: boolean }[]) => void
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ flashcards, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [results, setResults] = useState<{ cardId: string; correct: boolean }[]>([])

  const card = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100

  const playPronunciation = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    window.speechSynthesis.speak(utterance)
  }

  const handleResponse = (correct: boolean) => {
    const newResults = [...results, { cardId: card.id, correct }]
    setResults(newResults)

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      onComplete(newResults)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setResults([])
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const difficultyColors = {
    easy: 'from-green-500 to-green-600',
    medium: 'from-amber-500 to-amber-600',
    hard: 'from-rose-500 to-rose-600',
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {results.filter((r) => r.correct).length} correct
          </p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer h-80 perspective"
      >
        <Card
          className={`h-full p-8 flex flex-col items-center justify-center bg-gradient-to-br ${difficultyColors[card.difficulty]} text-white transition-transform duration-500 hover:shadow-xl`}
          hoverable
        >
          <div className="text-center space-y-4">
            <p className="text-sm font-semibold opacity-75">
              {isFlipped ? 'Definition' : 'Word'}
            </p>
            <p className="text-4xl font-bold">
              {isFlipped ? card.back : card.front}
            </p>
            <p className="text-sm opacity-75">Click to {isFlipped ? 'see word' : 'reveal'}</p>

            {!isFlipped && (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  playPronunciation(card.front)
                }}
                icon={<Volume2 size={16} />}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0"
              >
                Pronounce
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          icon={<ChevronLeft size={18} />}
          className="flex-1"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          icon={<ChevronRight size={18} />}
          className="flex-1"
        >
          Next
        </Button>
      </div>

      {/* Response Buttons */}
      {isFlipped && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="danger"
            onClick={() => handleResponse(false)}
            className="h-16 text-base font-bold"
          >
            ❌ Hard
          </Button>
          <Button
            variant="primary"
            onClick={() => handleResponse(true)}
            className="h-16 text-base font-bold"
          >
            ✓ Got it!
          </Button>
        </div>
      )}

      {/* Reset Button */}
      {results.length === flashcards.length && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900">
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">Session Complete! 🎉</p>
            <p className="text-green-800 dark:text-green-200">
              You got {results.filter((r) => r.correct).length} out of {flashcards.length} correct
            </p>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {Math.round((results.filter((r) => r.correct).length / flashcards.length) * 100)}%
            </div>
            <Button
              variant="primary"
              onClick={handleReset}
              icon={<RotateCcw size={18} />}
              className="w-full"
            >
              Start Again
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default FlashcardView
