'use client'

import React, { useMemo, useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import {
  BookOpen,
  Search,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Check,
  RotateCcw,
  Plus,
  X,
  Trash2,
  Flame,
  Target,
  TrendingUp,
  Library,
  AlertTriangle,
} from 'lucide-react'
import {
  categories,
  wordDatabase,
  VocabWord,
} from '@/lib/vocabularyData'
import {
  getStreakFromHistory,
  useVocabularyStore,
  WordStatus,
} from '@/store/useVocabularyStore'

const VocabularyPage = () => {
  const {
    wordStatus,
    studyHistory,
    totalInteractions,
    customWords,
    setWordStatus,
    addCustomWord,
    removeCustomWord,
    resetWordStatus,
    resetStats,
    resetCustomWords,
    resetAll,
  } = useVocabularyStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<WordStatus | 'all'>('all')
  const [showResetMenu, setShowResetMenu] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const [newWord, setNewWord] = useState('')
  const [newPronunciation, setNewPronunciation] = useState('')
  const [newMeaning, setNewMeaning] = useState('')
  const [newExample, setNewExample] = useState('')
  const [newCategory, setNewCategory] = useState('daily')
  const [newDifficulty, setNewDifficulty] = useState<VocabWord['difficulty']>('B1')
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('noun')
  const [addError, setAddError] = useState<string | null>(null)

  const allWords = useMemo<VocabWord[]>(
    () => [...wordDatabase, ...customWords],
    [customWords]
  )

  // Statistics
  const stats = useMemo(() => {
    const saved = Object.values(wordStatus).filter((s) => s === 'saved').length
    const learning = Object.values(wordStatus).filter((s) => s === 'learning').length
    const known = Object.values(wordStatus).filter((s) => s === 'known').length
    const today = new Date().toISOString().split('T')[0]
    const todayStudy = studyHistory.find((d) => d.date === today)?.wordsStudied || 0
    const streak = getStreakFromHistory(studyHistory)
    const total = allWords.length
    const progress = total > 0 ? Math.round((known / total) * 100) : 0

    return { saved, learning, known, todayStudy, streak, total, progress }
  }, [wordStatus, studyHistory, allWords])

  // Filtered words
  const filteredWords = useMemo(() => {
    return allWords.filter((w) => {
      const matchesCategory = !selectedCategory || w.category === selectedCategory
      const status = wordStatus[w.id] || 'new'
      const matchesFilter = selectedFilter === 'all' || status === selectedFilter
      const q = searchTerm.trim().toLowerCase()
      const matchesSearch =
        !q ||
        w.word.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)
      return matchesCategory && matchesFilter && matchesSearch
    })
  }, [allWords, selectedCategory, selectedFilter, searchTerm, wordStatus])

  // Per-category counts
  const categoryStats = useMemo(() => {
    const map: Record<string, { total: number; known: number }> = {}
    for (const cat of categories) {
      const wordsInCat = allWords.filter((w) => w.category === cat.id)
      map[cat.id] = {
        total: wordsInCat.length,
        known: wordsInCat.filter((w) => wordStatus[w.id] === 'known').length,
      }
    }
    return map
  }, [allWords, wordStatus])

  const playPronunciation = (word: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  const handleStatusToggle = (wordId: string, targetStatus: WordStatus) => {
    const current = wordStatus[wordId] || 'new'
    if (current === targetStatus) {
      setWordStatus(wordId, 'new')
    } else {
      setWordStatus(wordId, targetStatus)
    }
  }

  const handleAddWord = () => {
    setAddError(null)
    if (!newWord.trim() || !newMeaning.trim()) {
      setAddError('Palavra e significado são obrigatórios')
      return
    }
    const id = `custom-${Date.now()}`
    addCustomWord({
      id,
      word: newWord.trim(),
      pronunciation: newPronunciation.trim() || `/${newWord.trim()}/`,
      meaning: newMeaning.trim(),
      example: newExample.trim() || `Example with ${newWord.trim()}.`,
      category: newCategory,
      difficulty: newDifficulty,
      partOfSpeech: newPartOfSpeech,
    })
    setNewWord('')
    setNewPronunciation('')
    setNewMeaning('')
    setNewExample('')
    setShowAddModal(false)
  }

  const statusBadge = (status: WordStatus) => {
    const styles: Record<WordStatus, { label: string; cls: string }> = {
      new: { label: 'Nova', cls: 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400' },
      saved: {
        label: '🔖 Salva',
        cls: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      },
      learning: {
        label: '📖 Aprendendo',
        cls: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
      },
      known: {
        label: '✓ Aprendida',
        cls: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
      },
    }
    return styles[status]
  }

  const difficultyColor: Record<VocabWord['difficulty'], string> = {
    A1: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    A2: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    B1: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    B2: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
    C1: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
    C2: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  }

  const handleResetClick = (
    type: 'all' | 'words' | 'stats' | 'custom',
    label: string
  ) => {
    if (!confirm(`Tem certeza que deseja resetar: ${label}?`)) return
    if (type === 'all') resetAll()
    else if (type === 'words') resetWordStatus()
    else if (type === 'stats') resetStats()
    else if (type === 'custom') resetCustomWords()
    setShowResetMenu(false)
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Vocabulary Builder 📚
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Expanda seu vocabulário com palavras categorizadas e exemplos
            </p>
          </div>
          <div className="flex gap-2 relative">
            <Button
              variant="primary"
              icon={<Plus size={18} />}
              onClick={() => setShowAddModal(true)}
            >
              Nova palavra
            </Button>
            <Button
              variant="outline"
              icon={<RotateCcw size={18} />}
              onClick={() => setShowResetMenu(!showResetMenu)}
            >
              Resetar
            </Button>
            {showResetMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowResetMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-dark-800 rounded-xl shadow-2xl z-40 border border-gray-200 dark:border-dark-700">
                  <div className="p-3 border-b border-gray-200 dark:border-dark-700">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Opções de reset
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleResetClick('words', 'progresso de todas as palavras')
                    }
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 border-b border-gray-100 dark:border-dark-700 transition-colors"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Progresso de palavras
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Limpa salvas, aprendendo e conhecidas
                    </p>
                  </button>
                  <button
                    onClick={() => handleResetClick('stats', 'estatísticas e histórico')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 border-b border-gray-100 dark:border-dark-700 transition-colors"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Estatísticas
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Limpa histórico, sequência e total
                    </p>
                  </button>
                  <button
                    onClick={() => handleResetClick('custom', 'palavras customizadas')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 border-b border-gray-100 dark:border-dark-700 transition-colors"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Palavras customizadas
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Remove suas {customWords.length} palavras
                    </p>
                  </button>
                  <button
                    onClick={() => handleResetClick('all', 'TUDO')}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                      <AlertTriangle size={14} />
                      Resetar tudo
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-500">
                      Apaga progresso, stats e custom
                    </p>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30">
            <div className="flex items-center justify-between">
              <Library size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.total}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total de palavras</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
            <div className="flex items-center justify-between">
              <Check size={20} className="text-green-600 dark:text-green-400" />
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.known}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Aprendidas</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30">
            <div className="flex items-center justify-between">
              <BookOpen size={20} className="text-amber-600 dark:text-amber-400" />
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.learning}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Aprendendo</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30">
            <div className="flex items-center justify-between">
              <Bookmark size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.saved}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Salvas</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30">
            <div className="flex items-center justify-between">
              <Flame size={20} className="text-rose-600 dark:text-rose-400" />
              <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                {stats.streak}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Sequência (dias)</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30">
            <div className="flex items-center justify-between">
              <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.todayStudy}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Hoje</p>
          </Card>
        </div>

        {/* Overall progress bar */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-primary-600 dark:text-primary-400" />
              <p className="font-semibold text-gray-900 dark:text-white">
                Progresso Geral
              </p>
            </div>
            <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {stats.known}/{stats.total} ({stats.progress}%)
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Total de interações: {totalInteractions}
          </p>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar palavra ou significado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                selectedCategory === null
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-gray-200 dark:border-dark-700 hover:border-primary-300'
              }`}
            >
              <p className="text-2xl mb-1">🌐</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">Todas</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{allWords.length}</p>
            </button>
            {categories.map((cat) => {
              const cs = categoryStats[cat.id]
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    selectedCategory === cat.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-200 dark:border-dark-700 hover:border-primary-300'
                  }`}
                >
                  <p className="text-2xl mb-1">{cat.emoji}</p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {cs.known}/{cs.total}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { id: 'all', label: `Todas (${filteredWords.length})` },
              { id: 'new', label: `Novas (${allWords.length - Object.keys(wordStatus).length})` },
              { id: 'saved', label: `🔖 Salvas (${stats.saved})` },
              { id: 'learning', label: `📖 Aprendendo (${stats.learning})` },
              { id: 'known', label: `✓ Aprendidas (${stats.known})` },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as WordStatus | 'all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === f.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Word List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {filteredWords.length === 0 ? 'Nenhuma palavra encontrada' : `${filteredWords.length} palavras`}
          </h2>
          <div className="space-y-3">
            {filteredWords.map((word) => {
              const status = wordStatus[word.id] || 'new'
              const badge = statusBadge(status)
              const isCustom = word.id.startsWith('custom-')

              return (
                <Card
                  key={word.id}
                  className={`p-5 transition-all ${
                    status === 'known'
                      ? 'border-l-4 border-green-500'
                      : status === 'learning'
                        ? 'border-l-4 border-amber-500'
                        : status === 'saved'
                          ? 'border-l-4 border-blue-500'
                          : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {word.word}
                        </h3>
                        <button
                          onClick={() => playPronunciation(word.word)}
                          className="p-1.5 rounded text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                          title="Ouvir pronúncia"
                        >
                          <Volume2 size={16} />
                        </button>
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded ${difficultyColor[word.difficulty]}`}
                        >
                          {word.difficulty}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400">
                          {word.partOfSpeech}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${badge.cls}`}>
                          {badge.label}
                        </span>
                        {isCustom && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                            ⭐ Custom
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-mono mb-2">
                        {word.pronunciation}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">
                        {word.meaning}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        "{word.example}"
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <button
                        onClick={() => handleStatusToggle(word.id, 'saved')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                          status === 'saved'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                        }`}
                      >
                        {status === 'saved' ? (
                          <BookmarkCheck size={14} />
                        ) : (
                          <Bookmark size={14} />
                        )}
                        {status === 'saved' ? 'Salva' : 'Salvar'}
                      </button>
                      <button
                        onClick={() => handleStatusToggle(word.id, 'learning')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                          status === 'learning'
                            ? 'bg-amber-600 text-white'
                            : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                        }`}
                      >
                        <BookOpen size={14} />
                        Aprendendo
                      </button>
                      <button
                        onClick={() => handleStatusToggle(word.id, 'known')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                          status === 'known'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50'
                        }`}
                      >
                        <Check size={14} />
                        Aprendi
                      </button>
                      {isCustom && (
                        <button
                          onClick={() => {
                            if (confirm('Excluir esta palavra customizada?')) {
                              removeCustomWord(word.id)
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 size={14} />
                          Excluir
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Tips */}
        <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={28} className="text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dicas de Aprendizado
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                Aprenda em contexto
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Estude palavras em frases, não definições isoladas.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                Repetição espaçada
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Revise novas palavras após 1 dia, 3 dias, 1 semana e 1 mês.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Recall ativo</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Teste-se antes de olhar a definição.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Word Modal */}
      {showAddModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowAddModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 bg-white dark:bg-dark-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-700 sticky top-0 bg-white dark:bg-dark-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Nova Palavra
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Palavra *
                </label>
                <input
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Ex: serendipity"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Pronúncia (opcional)
                </label>
                <input
                  value={newPronunciation}
                  onChange={(e) => setNewPronunciation(e.target.value)}
                  placeholder="Ex: /ˌserənˈdɪpəti/"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Significado *
                </label>
                <input
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="Ex: Finding something valuable by chance"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Exemplo (opcional)
                </label>
                <textarea
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="Ex: It was pure serendipity that we met."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Nível
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) =>
                      setNewDifficulty(e.target.value as VocabWord['difficulty'])
                    }
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Classe
                  </label>
                  <select
                    value={newPartOfSpeech}
                    onChange={(e) => setNewPartOfSpeech(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="noun">noun</option>
                    <option value="verb">verb</option>
                    <option value="adjective">adjective</option>
                    <option value="adverb">adverb</option>
                  </select>
                </div>
              </div>

              {addError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-300">
                  {addError}
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-dark-700 sticky bottom-0 bg-white dark:bg-dark-800">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleAddWord}>
                Adicionar
              </Button>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export default VocabularyPage
