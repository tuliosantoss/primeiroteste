import React, { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Volume2, Zap } from 'lucide-react'
import { ReadingMaterial, VocabularyItem } from '@/types'

interface ReadingPanelProps {
  material: ReadingMaterial
}

const ReadingPanel: React.FC<ReadingPanelProps> = ({ material }) => {
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null)
  const [fontSize, setFontSize] = useState(16)

  const playPronunciation = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    window.speechSynthesis.speak(utterance)
  }

  const handleWordClick = (word: VocabularyItem) => {
    setSelectedWord(word)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Reading Panel */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{material.title}</h2>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{material.wordCount} words</span>
              <span>~{material.estimatedReadingTime} min read</span>
            </div>
          </div>

          {/* Font Size Control */}
          <div className="flex gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-dark-700">
            <button
              onClick={() => setFontSize(14)}
              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                fontSize === 14
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize(16)}
              className={`px-3 py-1 rounded text-base font-semibold transition-colors ${
                fontSize === 16
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize(18)}
              className={`px-3 py-1 rounded text-lg font-semibold transition-colors ${
                fontSize === 18
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300'
              }`}
            >
              A
            </button>
          </div>

          {/* Reading Content */}
          <div
            className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
            style={{ fontSize: `${fontSize}px` }}
          >
            <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
              {material.content.split(/\s+/).map((word, index) => {
                const foundVocab = material.vocabulary.find(
                  (v) => v.word.toLowerCase() === word.toLowerCase().replace(/[.,!?;:]/g, '')
                )

                return (
                  <span key={index}>
                    {foundVocab ? (
                      <button
                        onClick={() => handleWordClick(foundVocab)}
                        className="text-primary-600 dark:text-primary-400 underline hover:text-primary-700 dark:hover:text-primary-300 cursor-pointer font-semibold"
                      >
                        {word}
                      </button>
                    ) : (
                      word
                    )}{' '}
                  </span>
                )
              })}
            </p>
          </div>

          {/* Comprehension Questions */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Comprehension Questions</h3>
            <div className="space-y-4">
              {material.comprehensionQuestions.map((question) => (
                <div key={question.id} className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <p className="font-semibold text-gray-900 dark:text-white mb-3">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Vocabulary Panel */}
      <div className="space-y-6">
        {selectedWord && (
          <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800 border border-primary-200 dark:border-primary-800">
            <button
              onClick={() => setSelectedWord(null)}
              className="float-right text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>

            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedWord.word}</p>
                <p className="text-sm text-primary-600 dark:text-primary-400 italic">
                  /{selectedWord.pronunciation}/
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">PART OF SPEECH</p>
                <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedWord.partOfSpeech}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">DEFINITION</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedWord.definition}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">EXAMPLE</p>
                <p className="text-sm text-gray-900 dark:text-white italic">"{selectedWord.example}"</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => playPronunciation(selectedWord.word)}
                  icon={<Volume2 size={16} />}
                  className="flex-1"
                >
                  Listen
                </Button>
                <Button variant="outline" size="sm" className="flex-1" icon={<Zap size={16} />}>
                  Save
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Word List */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Vocabulary</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {material.vocabulary.map((vocab) => (
              <button
                key={vocab.id}
                onClick={() => handleWordClick(vocab)}
                className="w-full text-left p-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
              >
                <p className="font-semibold text-gray-900 dark:text-white">{vocab.word}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{vocab.definition}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ReadingPanel
