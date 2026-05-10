import React, { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Send, Sparkles } from 'lucide-react'
import { WritingExercise, GrammarCorrection } from '@/types'

interface WritingEditorProps {
  exercise: WritingExercise
  onSubmit: (content: string) => void
}

const WritingEditor: React.FC<WritingEditorProps> = ({ exercise, onSubmit }) => {
  const [content, setContent] = useState('')
  const [corrections, setCorrections] = useState<GrammarCorrection[]>([])
  const [showCorrections, setShowCorrections] = useState(false)

  const wordCount = content.trim().split(/\s+/).length

  const handleCheckGrammar = async () => {
    // Simulating grammar check - would connect to API
    const mockCorrections: GrammarCorrection[] = [
      {
        original: 'I goes',
        corrected: 'I go',
        type: 'grammar',
        explanation: 'Subject-verb agreement: Third person singular requires "goes"',
      },
    ]
    setCorrections(mockCorrections)
    setShowCorrections(true)
  }

  const handleSubmit = () => {
    if (wordCount >= exercise.minWords) {
      onSubmit(content)
    }
  }

  const difficultyColors = {
    beginner: 'text-green-600 dark:text-green-400',
    intermediate: 'text-amber-600 dark:text-amber-400',
    advanced: 'text-rose-600 dark:text-rose-400',
  }

  return (
    <div className="space-y-6">
      <Card className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{exercise.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{exercise.topic}</p>
        </div>

        {/* Prompt */}
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">📝 Write about:</p>
          <p className="text-sm text-blue-800 dark:text-blue-300">{exercise.prompt}</p>
        </div>

        {/* Word Count Requirements */}
        <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Word Count</p>
            <p className={`text-lg font-bold ${difficultyColors[exercise.difficulty]}`}>
              {wordCount} / {exercise.minWords} - {exercise.maxWords}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 dark:text-gray-400">Difficulty</p>
            <p className={`text-sm font-semibold ${difficultyColors[exercise.difficulty]}`}>
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </p>
          </div>
        </div>

        {/* Editor */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your essay here..."
          className="w-full h-80 p-4 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleCheckGrammar}
            icon={<Sparkles size={18} />}
            className="flex-1"
          >
            Check Grammar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={wordCount < exercise.minWords}
            icon={<Send size={18} />}
            className="flex-1"
          >
            Submit Essay
          </Button>
        </div>
      </Card>

      {/* Corrections Panel */}
      {showCorrections && corrections.length > 0 && (
        <Card className="p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Grammar Corrections</h4>
            <button
              onClick={() => setShowCorrections(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {corrections.map((correction, index) => (
              <div
                key={index}
                className="p-4 bg-amber-50 dark:bg-amber-900 rounded-lg border border-amber-200 dark:border-amber-800"
              >
                <div className="flex gap-2 mb-2">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-amber-200 dark:bg-amber-700 text-amber-900 dark:text-amber-200">
                    {correction.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm mb-2">
                  <span className="line-through text-red-600">{correction.original}</span>
                  {' → '}
                  <span className="text-green-600 font-semibold">{correction.corrected}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{correction.explanation}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default WritingEditor
