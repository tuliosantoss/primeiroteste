'use client'

import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import {
  Send,
  Sparkles,
  Loader,
  AlertTriangle,
  X,
  CheckCircle2,
  Save,
  Download,
  RefreshCw,
} from 'lucide-react'
import { WritingExercise } from '@/types'
import {
  analyzeText,
  checkGrammar,
  GrammarIssue,
  loadDraft,
  saveDraft,
  clearDraft,
  downloadAsText,
} from '@/lib/writing'

interface WritingEditorProps {
  exercise: WritingExercise
  onSubmit: (content: string) => void
}

const WritingEditor: React.FC<WritingEditorProps> = ({ exercise, onSubmit }) => {
  const [content, setContent] = useState('')
  const [issues, setIssues] = useState<GrammarIssue[]>([])
  const [showIssues, setShowIssues] = useState(false)
  const [checking, setChecking] = useState(false)
  const [grammarError, setGrammarError] = useState<string | null>(null)
  const [autoSaved, setAutoSaved] = useState(false)

  // Load draft on mount or exercise change
  useEffect(() => {
    setContent(loadDraft(exercise.id))
    setIssues([])
    setShowIssues(false)
    setGrammarError(null)
  }, [exercise.id])

  // Autosave with debounce
  useEffect(() => {
    if (!content.trim()) return
    const timer = setTimeout(() => {
      saveDraft(exercise.id, content)
      setAutoSaved(true)
      setTimeout(() => setAutoSaved(false), 1500)
    }, 800)
    return () => clearTimeout(timer)
  }, [content, exercise.id])

  const stats = analyzeText(content)

  const handleCheckGrammar = async () => {
    if (!content.trim()) return
    setChecking(true)
    setGrammarError(null)
    try {
      const result = await checkGrammar(content)
      setIssues(result)
      setShowIssues(true)
    } catch (err) {
      setGrammarError(
        err instanceof Error
          ? `Erro ao verificar: ${err.message}. Limite: 20 req/min.`
          : 'Erro ao verificar gramática'
      )
    } finally {
      setChecking(false)
    }
  }

  const handleApplyReplacement = (issue: GrammarIssue, replacement: string) => {
    const before = content.substring(0, issue.offset)
    const after = content.substring(issue.offset + issue.length)
    const newContent = before + replacement + after
    setContent(newContent)
    // Remove this issue and shift offsets of subsequent issues
    const diff = replacement.length - issue.length
    setIssues((prev) =>
      prev
        .filter((i) => i !== issue)
        .map((i) =>
          i.offset > issue.offset ? { ...i, offset: i.offset + diff } : i
        )
    )
  }

  const handleSubmit = () => {
    if (stats.words >= exercise.minWords) {
      onSubmit(content)
      clearDraft(exercise.id)
    }
  }

  const handleDownload = () => {
    if (!content.trim()) return
    const filename = `${exercise.title.toLowerCase().replace(/\s+/g, '-')}.txt`
    downloadAsText(filename, content)
  }

  const handleClear = () => {
    if (!content.trim()) return
    if (confirm('Limpar todo o texto? Essa ação não pode ser desfeita.')) {
      setContent('')
      clearDraft(exercise.id)
      setIssues([])
      setShowIssues(false)
    }
  }

  const difficultyColors = {
    beginner: 'text-green-600 dark:text-green-400',
    intermediate: 'text-amber-600 dark:text-amber-400',
    advanced: 'text-rose-600 dark:text-rose-400',
  }

  const wordCountColor =
    stats.words >= exercise.minWords && stats.words <= exercise.maxWords
      ? 'text-green-600 dark:text-green-400'
      : stats.words < exercise.minWords
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400'

  const issueColors: Record<string, string> = {
    misspelling: 'border-red-500 bg-red-50 dark:bg-red-900/30',
    grammar: 'border-amber-500 bg-amber-50 dark:bg-amber-900/30',
    style: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30',
    typographical: 'border-purple-500 bg-purple-50 dark:bg-purple-900/30',
  }

  return (
    <div className="space-y-6">
      <Card className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {exercise.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{exercise.topic}</p>
          </div>
          {autoSaved && (
            <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 animate-pulse">
              <Save size={12} />
              Rascunho salvo
            </span>
          )}
        </div>

        {/* Prompt */}
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
            📝 Escreva sobre:
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-300">{exercise.prompt}</p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Palavras</p>
            <p className={`text-lg font-bold ${wordCountColor}`}>
              {stats.words}
              <span className="text-xs text-gray-500 ml-1">
                /{exercise.minWords}-{exercise.maxWords}
              </span>
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Frases</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.sentences}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Parágrafos</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.paragraphs}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Únicas</p>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {stats.uniqueWords}
              <span className="text-xs text-gray-500 ml-1">
                ({Math.round(stats.vocabularyDiversity * 100)}%)
              </span>
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Dificuldade</p>
            <p className={`text-sm font-semibold ${difficultyColors[exercise.difficulty]}`}>
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </p>
          </div>
        </div>

        {/* Editor */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comece a escrever aqui... (autosave a cada 0.8s)"
          className="w-full h-80 p-4 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm leading-relaxed"
        />

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleCheckGrammar}
            disabled={checking || !content.trim()}
            icon={
              checking ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )
            }
            className="flex-1 min-w-[140px]"
          >
            {checking ? 'Verificando...' : 'Check Grammar'}
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!content.trim()}
            icon={<Download size={18} />}
          >
            Baixar
          </Button>
          <Button
            variant="ghost"
            onClick={handleClear}
            disabled={!content.trim()}
            icon={<RefreshCw size={18} />}
          >
            Limpar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={stats.words < exercise.minWords}
            icon={<Send size={18} />}
            className="flex-1 min-w-[140px]"
          >
            Enviar Texto
          </Button>
        </div>

        {grammarError && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle
              className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
              size={16}
            />
            <p className="text-sm text-red-700 dark:text-red-300">{grammarError}</p>
          </div>
        )}
      </Card>

      {/* Grammar Issues Panel */}
      {showIssues && (
        <Card className="p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                Análise Gramatical
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {issues.length === 0
                  ? '✨ Nenhum problema encontrado!'
                  : `${issues.length} ${issues.length === 1 ? 'sugestão' : 'sugestões'} encontradas`}
              </p>
            </div>
            <button
              onClick={() => setShowIssues(false)}
              className="p-1 rounded text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {issues.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
              <p className="text-sm text-green-800 dark:text-green-200">
                Seu texto está sem problemas detectados pelo LanguageTool.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    issueColors[issue.type] || issueColors.grammar
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 capitalize">
                      {issue.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      pos. {issue.offset}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {issue.message}
                  </p>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-mono">
                    "...{' '}
                    <span className="bg-yellow-200 dark:bg-yellow-700 px-1 rounded">
                      {issue.original}
                    </span>{' '}
                    ..."
                  </p>

                  {issue.replacements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mr-1 mt-1">
                        Sugestões:
                      </span>
                      {issue.replacements.map((rep, ridx) => (
                        <button
                          key={ridx}
                          onClick={() => handleApplyReplacement(issue, rep)}
                          className="px-2 py-1 text-xs font-medium rounded bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                        >
                          {rep || '(remover)'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

export default WritingEditor
