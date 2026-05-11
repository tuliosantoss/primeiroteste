'use client'

import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import WritingEditor from '@/components/Writing/WritingEditor'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { WritingExercise } from '@/types'
import {
  Award,
  BookOpen,
  Plus,
  X,
  History,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react'
import {
  generateFeedback,
  loadSubmissions,
  saveSubmission,
  deleteSubmission,
  SavedSubmission,
  WritingFeedback,
  downloadAsText,
} from '@/lib/writing'

const baseExercises: WritingExercise[] = [
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
    title: 'Daily Routine',
    topic: 'Lifestyle',
    prompt:
      'Describe your typical weekday from morning to night. Use present simple tense and connect ideas with words like "first", "then", "after that".',
    difficulty: 'beginner',
    minWords: 80,
    maxWords: 150,
  },
  {
    id: '3',
    title: 'Formal Email',
    topic: 'Professional Communication',
    prompt:
      "Write a formal email to your manager requesting a day off for a doctor's appointment. Include a brief explanation and suggest an alternative date if needed.",
    difficulty: 'intermediate',
    minWords: 100,
    maxWords: 200,
  },
  {
    id: '4',
    title: 'Travel Experience',
    topic: 'Storytelling',
    prompt:
      'Describe a memorable travel experience. Where did you go, what did you do, and what made it special? Use past tenses correctly.',
    difficulty: 'intermediate',
    minWords: 150,
    maxWords: 250,
  },
  {
    id: '5',
    title: 'Product Review',
    topic: 'Critical Writing',
    prompt:
      'Write a balanced review of a product you recently purchased. Mention features, pros, cons, and your overall recommendation.',
    difficulty: 'intermediate',
    minWords: 150,
    maxWords: 250,
  },
  {
    id: '6',
    title: 'Opinion Essay',
    topic: 'Advanced Writing',
    prompt:
      'Write an essay about the impact of social media on modern society. Include your opinion, supporting arguments, and examples. Discuss both positive and negative effects.',
    difficulty: 'advanced',
    minWords: 250,
    maxWords: 400,
  },
  {
    id: '7',
    title: 'Job Application Cover Letter',
    topic: 'Professional Writing',
    prompt:
      'Write a cover letter for a software engineer position at a tech company. Highlight your relevant experience, skills, and why you want to work there.',
    difficulty: 'advanced',
    minWords: 200,
    maxWords: 350,
  },
  {
    id: '8',
    title: 'Argumentative Essay',
    topic: 'Critical Thinking',
    prompt:
      'Should artificial intelligence be regulated by governments? Take a clear position and support it with at least three arguments and counter-arguments.',
    difficulty: 'advanced',
    minWords: 300,
    maxWords: 500,
  },
]

const CUSTOM_KEY = 'writing-custom-exercises'

const loadCustom = (): WritingExercise[] => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]')
  } catch {
    return []
  }
}

const saveCustom = (exercises: WritingExercise[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(exercises))
}

const WritingPage = () => {
  const [customExercises, setCustomExercises] = useState<WritingExercise[]>([])
  const [exercises, setExercises] = useState<WritingExercise[]>(baseExercises)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [submittedContent, setSubmittedContent] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [submissions, setSubmissions] = useState<SavedSubmission[]>([])
  const [viewingSubmission, setViewingSubmission] = useState<SavedSubmission | null>(null)

  const [customTitle, setCustomTitle] = useState('')
  const [customTopic, setCustomTopic] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [customDifficulty, setCustomDifficulty] = useState<
    'beginner' | 'intermediate' | 'advanced'
  >('intermediate')
  const [customMin, setCustomMin] = useState(100)
  const [customMax, setCustomMax] = useState(200)
  const [customError, setCustomError] = useState<string | null>(null)

  useEffect(() => {
    const custom = loadCustom()
    setCustomExercises(custom)
    setExercises([...baseExercises, ...custom])
    setSubmissions(loadSubmissions())
  }, [])

  const handleSubmit = (content: string) => {
    setSubmittedContent(content)
    const exercise = exercises[currentExercise]
    const fb = generateFeedback(content, exercise)
    setFeedback(fb)

    const submission: SavedSubmission = {
      id: `sub-${Date.now()}`,
      exerciseTitle: exercise.title,
      content,
      submittedAt: new Date().toISOString(),
      feedback: fb,
    }
    saveSubmission(submission)
    setSubmissions(loadSubmissions())

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  }

  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setSubmittedContent(null)
      setFeedback(null)
    }
  }

  const handlePreviousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      setSubmittedContent(null)
      setFeedback(null)
    }
  }

  const handleSelectExercise = (idx: number) => {
    setCurrentExercise(idx)
    setSubmittedContent(null)
    setFeedback(null)
  }

  const handleAddCustom = () => {
    setCustomError(null)
    if (!customTitle.trim() || !customPrompt.trim()) {
      setCustomError('Título e prompt são obrigatórios')
      return
    }
    if (customMin >= customMax || customMin < 10) {
      setCustomError('Mínimo deve ser menor que o máximo (≥10 palavras)')
      return
    }

    const newExercise: WritingExercise = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      topic: customTopic.trim() || 'Custom',
      prompt: customPrompt.trim(),
      difficulty: customDifficulty,
      minWords: customMin,
      maxWords: customMax,
    }

    const updated = [...customExercises, newExercise]
    setCustomExercises(updated)
    saveCustom(updated)
    setExercises([...baseExercises, ...updated])

    setCustomTitle('')
    setCustomTopic('')
    setCustomPrompt('')
    setCustomMin(100)
    setCustomMax(200)
    setCustomDifficulty('intermediate')
    setShowCustomModal(false)
  }

  const handleDeleteCustom = (id: string) => {
    if (!confirm('Excluir este exercício?')) return
    const updated = customExercises.filter((e) => e.id !== id)
    setCustomExercises(updated)
    saveCustom(updated)
    setExercises([...baseExercises, ...updated])
    if (currentExercise >= baseExercises.length + updated.length) {
      setCurrentExercise(0)
    }
  }

  const handleDeleteSubmission = (id: string) => {
    if (!confirm('Excluir esta submissão?')) return
    const remaining = deleteSubmission(id)
    setSubmissions(remaining)
    if (viewingSubmission?.id === id) setViewingSubmission(null)
  }

  const handleDownloadSubmission = (sub: SavedSubmission) => {
    const filename = `${sub.exerciseTitle.toLowerCase().replace(/\s+/g, '-')}-${sub.id}.txt`
    downloadAsText(filename, sub.content)
  }

  const exercise = exercises[currentExercise]
  const isCustomExercise = exercise?.id?.startsWith('custom-')

  const scoreColor = feedback
    ? feedback.score >= 80
      ? 'text-green-600 dark:text-green-400'
      : feedback.score >= 60
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400'
    : ''

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Writing Practice ✍️
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Aprimore sua gramática, vocabulário e expressão escrita
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={() => setShowCustomModal(true)}
          >
            Novo Exercício
          </Button>
          <Button
            variant="outline"
            icon={<History size={18} />}
            onClick={() => setShowHistory(!showHistory)}
          >
            Histórico ({submissions.length})
          </Button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Submissões Anteriores
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <X size={18} />
              </button>
            </div>
            {submissions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                Nenhuma submissão ainda. Envie um texto para começar.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {sub.exerciseTitle}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(sub.submittedAt).toLocaleString('pt-BR')} ·{' '}
                        {sub.feedback.stats.words} palavras · Nota{' '}
                        <strong>{sub.feedback.score}</strong>
                      </p>
                    </div>
                    <div className="flex gap-1 ml-3">
                      <button
                        onClick={() => setViewingSubmission(sub)}
                        className="p-2 rounded text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                        title="Ver"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadSubmission(sub)}
                        className="p-2 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600"
                        title="Baixar"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSubmission(sub.id)}
                        className="p-2 rounded text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Exercise Selector */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Selecione um exercício ({currentExercise + 1} de {exercises.length})
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {exercises.map((ex, idx) => {
              const isCustom = ex.id.startsWith('custom-')
              return (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExercise(idx)}
                  className={`relative flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    idx === currentExercise
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                  }`}
                >
                  {isCustom && '⭐ '}
                  {ex.title}
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handlePreviousExercise}
              disabled={currentExercise === 0}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors text-sm"
            >
              ← Anterior
            </button>
            <button
              onClick={handleNextExercise}
              disabled={currentExercise === exercises.length - 1}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors text-sm"
            >
              Próximo →
            </button>
          </div>
          {isCustomExercise && (
            <button
              onClick={() => handleDeleteCustom(exercise.id)}
              className="px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-sm flex items-center gap-2"
            >
              <Trash2 size={14} />
              Excluir exercício
            </button>
          )}
        </div>

        {/* Editor */}
        <WritingEditor exercise={exercise} onSubmit={handleSubmit} />

        {/* Submission Feedback */}
        {submittedContent && feedback && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Seu Texto
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg text-gray-800 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                  {submittedContent}
                </div>
              </Card>

              {/* Detailed Feedback */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Análise Detalhada
                </h3>

                {feedback.strengths.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Pontos fortes
                    </p>
                    <div className="space-y-2">
                      {feedback.strengths.map((s, i) => (
                        <div
                          key={i}
                          className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg text-sm text-green-800 dark:text-green-200"
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {feedback.suggestions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <Lightbulb size={16} />
                      Sugestões de melhoria
                    </p>
                    <div className="space-y-2">
                      {feedback.suggestions.map((s, i) => (
                        <div
                          key={i}
                          className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-800 dark:text-blue-200"
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {feedback.warnings.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                      <AlertTriangle size={16} />
                      Avisos
                    </p>
                    <div className="space-y-2">
                      {feedback.warnings.map((w, i) => (
                        <div
                          key={i}
                          className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-sm text-amber-800 dark:text-amber-200"
                        >
                          {w}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              {/* Score Card */}
              <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800">
                <div className="flex items-center gap-3 mb-4">
                  <Award size={24} className="text-primary-600 dark:text-primary-400" />
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    Sua Nota
                  </h4>
                </div>
                <p className={`text-5xl font-bold text-center ${scoreColor}`}>
                  {feedback.score}
                  <span className="text-2xl text-gray-500">/100</span>
                </p>
                <div className="mt-4 w-full bg-gray-200 dark:bg-dark-600 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      feedback.score >= 80
                        ? 'bg-green-500'
                        : feedback.score >= 60
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${feedback.score}%` }}
                  />
                </div>
              </Card>

              {/* Detailed Stats */}
              <Card className="p-6">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Estatísticas
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Palavras</span>
                    <span className="font-semibold">{feedback.stats.words}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Frases</span>
                    <span className="font-semibold">{feedback.stats.sentences}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Parágrafos</span>
                    <span className="font-semibold">{feedback.stats.paragraphs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Palavras únicas
                    </span>
                    <span className="font-semibold">
                      {feedback.stats.uniqueWords} (
                      {Math.round(feedback.stats.vocabularyDiversity * 100)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Média/frase</span>
                    <span className="font-semibold">
                      {Math.round(feedback.stats.avgWordsPerSentence)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tempo leitura</span>
                    <span className="font-semibold">~{feedback.stats.readingTime} min</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-dark-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Nível de leitura (Flesch)
                    </p>
                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {feedback.stats.fleschLevel}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Score: {feedback.stats.fleschScore}/100
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
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dicas de Escrita
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✓ Faça</h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Varie a estrutura das frases (curtas e longas)</li>
                <li>• Use o "Check Grammar" para revisar antes de enviar</li>
                <li>• Use conectivos: however, therefore, in addition</li>
                <li>• Leia em voz alta para captar erros</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✗ Evite</h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Repetir as mesmas palavras (use sinônimos)</li>
                <li>• Frases muito longas sem pontuação</li>
                <li>• Linguagem informal em textos formais</li>
                <li>• Ignorar parágrafos (use linha em branco)</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Custom Exercise Modal */}
      {showCustomModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCustomModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 bg-white dark:bg-dark-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-700 sticky top-0 bg-white dark:bg-dark-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Novo Exercício de Escrita
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Título *
                </label>
                <input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Ex: My Favorite Book"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Tópico
                </label>
                <input
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Ex: Literature"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Prompt *
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Descreva o que o aluno deve escrever..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Nível
                  </label>
                  <select
                    value={customDifficulty}
                    onChange={(e) =>
                      setCustomDifficulty(
                        e.target.value as 'beginner' | 'intermediate' | 'advanced'
                      )
                    }
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Mín palavras
                  </label>
                  <input
                    type="number"
                    value={customMin}
                    onChange={(e) => setCustomMin(parseInt(e.target.value) || 0)}
                    min={10}
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Máx palavras
                  </label>
                  <input
                    type="number"
                    value={customMax}
                    onChange={(e) => setCustomMax(parseInt(e.target.value) || 0)}
                    min={10}
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {customError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-300">
                  {customError}
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-dark-700 sticky bottom-0 bg-white dark:bg-dark-800">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowCustomModal(false)}
              >
                Cancelar
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleAddCustom}>
                Adicionar
              </Button>
            </div>
          </div>
        </>
      )}

      {/* View Submission Modal */}
      {viewingSubmission && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setViewingSubmission(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 bg-white dark:bg-dark-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-700 sticky top-0 bg-white dark:bg-dark-800">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {viewingSubmission.exerciseTitle}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(viewingSubmission.submittedAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <button
                onClick={() => setViewingSubmission(null)}
                className="p-1 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Nota</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {viewingSubmission.feedback.score}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Palavras</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {viewingSubmission.feedback.stats.words}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Únicas</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(
                      viewingSubmission.feedback.stats.vocabularyDiversity * 100
                    )}
                    %
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Texto:
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {viewingSubmission.content}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export default WritingPage
