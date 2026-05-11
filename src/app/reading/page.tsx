'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import ReadingPanel from '@/components/Reading/ReadingPanel'
import Card from '@/components/Card'
import Button from '@/components/Button'
import {
  BookMarked,
  Upload,
  Search,
  X,
  Loader,
  AlertTriangle,
  Plus,
  Trash2,
} from 'lucide-react'
import { ReadingMaterial, VocabularyItem } from '@/types'
import {
  parseCSV,
  searchWikipedia,
  fetchWikipediaArticle,
  extractVocabularyFromText,
  generateComprehensionQuestions,
} from '@/lib/reading'

const defaultVocabulary: VocabularyItem[] = [
  {
    id: '1',
    word: 'resilience',
    pronunciation: "rɪ'zɪləns",
    definition: 'The ability to recover quickly from difficulties',
    example: 'Her resilience helped her overcome many challenges.',
    partOfSpeech: 'noun',
    difficulty: 'B1',
    synonyms: ['toughness', 'strength', 'endurance'],
    category: 'general',
  },
  {
    id: '2',
    word: 'persevere',
    pronunciation: "pɜːr.sə'vɪr",
    definition: 'To continue firmly in a course of action despite difficulty',
    example: 'You must persevere if you want to succeed.',
    partOfSpeech: 'verb',
    difficulty: 'B1',
    synonyms: ['persist', 'continue', 'carry on'],
    category: 'general',
  },
]

const defaultMaterials: ReadingMaterial[] = [
  {
    id: '1',
    title: 'The Power of Positive Thinking',
    content: `Positive thinking is a mental and emotional attitude that focuses on the bright side of life. People who practice positive thinking believe that good things will happen, and they look for opportunities rather than problems.

Research shows that positive thinking has many benefits. It can improve mental health, reduce stress, and increase resilience when facing challenges. People who think positively tend to be more motivated and persevere longer in pursuing their goals.

Developing a positive mindset doesn't mean ignoring problems. Instead, it means approaching difficulties with confidence and finding solutions. You can start by noticing negative thoughts and consciously replacing them with positive ones. Surround yourself with positive people, practice gratitude daily, and focus on your strengths.

Remember, changing your thinking patterns takes time and effort, but the rewards are worth it. A positive outlook can transform your life and help you achieve your dreams.`,
    difficulty: 'beginner',
    wordCount: 178,
    estimatedReadingTime: 3,
    vocabulary: defaultVocabulary,
    comprehensionQuestions: [
      {
        id: '1',
        question: 'What is the main benefit of positive thinking mentioned in the text?',
        options: [
          'It guarantees success',
          'It can improve mental health and reduce stress',
          'It eliminates all problems',
          'It makes people rich',
        ],
        correctAnswer: 'It can improve mental health and reduce stress',
        explanation: 'The text explicitly states that positive thinking can improve mental health and reduce stress.',
      },
      {
        id: '2',
        question: 'How can you develop a positive mindset according to the passage?',
        options: [
          'By ignoring all problems',
          'By avoiding negative people',
          'By replacing negative thoughts with positive ones and practicing gratitude',
          'By working harder than everyone else',
        ],
        correctAnswer: 'By replacing negative thoughts with positive ones and practicing gratitude',
        explanation: 'The text recommends replacing negative thoughts with positive ones and practicing gratitude daily.',
      },
    ],
  },
  {
    id: '2',
    title: 'Technology and Modern Life',
    content: `Technology has become an integral part of our daily lives. From smartphones to artificial intelligence, technological innovations continue to shape how we work, communicate, and live.

The internet has revolutionized the way we access information and connect with people worldwide. Social media platforms enable us to maintain relationships across distances, while online education makes learning accessible to everyone. E-commerce has changed shopping habits, and remote work has provided flexibility for millions of workers.

However, technology also presents challenges. Excessive screen time can affect our mental and physical health. Privacy concerns have grown as companies collect more data. Additionally, the rapid pace of technological change can make some skills obsolete, requiring continuous learning.

The key is finding balance. We should use technology as a tool to enhance our lives while maintaining healthy offline activities. As we move forward, it's crucial to develop digital literacy and understand both the benefits and risks of technological advancement.`,
    difficulty: 'intermediate',
    wordCount: 182,
    estimatedReadingTime: 4,
    vocabulary: defaultVocabulary,
    comprehensionQuestions: [
      {
        id: '3',
        question: 'What is the main topic of this passage?',
        options: [
          'The history of computers',
          'How to become a programmer',
          'The impact of technology on modern life',
          'Why you should avoid technology',
        ],
        correctAnswer: 'The impact of technology on modern life',
        explanation: 'The passage discusses how technology has become integral to our daily lives and its various impacts.',
      },
    ],
  },
]

type ModalType = 'csv' | 'search' | null

const ReadingPage = () => {
  const [materials, setMaterials] = useState<ReadingMaterial[]>(defaultMaterials)
  const [currentMaterial, setCurrentMaterial] = useState(0)
  const [modalOpen, setModalOpen] = useState<ModalType>(null)
  const [csvError, setCsvError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ title: string; extract: string }>>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [fetchingArticle, setFetchingArticle] = useState(false)

  const handleCSVUpload = async (file: File) => {
    try {
      setCsvError(null)
      const text = await file.text()
      const parsed = parseCSV(text)

      if (parsed.length === 0) {
        setCsvError('Nenhum texto válido encontrado no CSV. Formato esperado: title, content, difficulty')
        return
      }

      const newMaterials = parsed.map((item, idx) => ({
        id: `csv-${Date.now()}-${idx}`,
        title: item.title,
        content: item.content,
        difficulty: item.difficulty,
        wordCount: item.content.split(/\s+/).length,
        estimatedReadingTime: Math.ceil(item.content.split(/\s+/).length / 200),
        vocabulary: extractVocabularyFromText(item.content, 5),
        comprehensionQuestions: generateComprehensionQuestions(item.content, item.title),
      }))

      setMaterials((prev) => [...prev, ...newMaterials])
      setModalOpen(null)
      setCsvError(null)
    } catch (err) {
      setCsvError(err instanceof Error ? err.message : 'Erro ao processar o arquivo')
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearchLoading(true)
    setSearchError(null)
    try {
      const results = await searchWikipedia(searchQuery)
      setSearchResults(results)
      if (results.length === 0) {
        setSearchError('Nenhum resultado encontrado')
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Erro na busca')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleFetchArticle = async (title: string) => {
    setFetchingArticle(true)
    try {
      const article = await fetchWikipediaArticle(title)
      if (article) {
        const newMaterial: ReadingMaterial = {
          id: `wiki-${Date.now()}`,
          title: article.title,
          content: article.content,
          difficulty: 'intermediate',
          wordCount: article.content.split(/\s+/).length,
          estimatedReadingTime: Math.ceil(article.content.split(/\s+/).length / 200),
          vocabulary: extractVocabularyFromText(article.content, 5),
          comprehensionQuestions: generateComprehensionQuestions(article.content, article.title),
        }
        setMaterials((prev) => [...prev, newMaterial])
        setCurrentMaterial(materials.length)
        setModalOpen(null)
        setSearchQuery('')
        setSearchResults([])
      }
    } finally {
      setFetchingArticle(false)
    }
  }

  const handleDeleteMaterial = (id: string) => {
    if (materials.length <= 1) {
      alert('Você precisa ter pelo menos um texto')
      return
    }
    const newMaterials = materials.filter((m) => m.id !== id)
    setMaterials(newMaterials)
    if (currentMaterial >= newMaterials.length) {
      setCurrentMaterial(newMaterials.length - 1)
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Reading Practice 📖
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Melhore sua compreensão e expanda seu vocabulário
          </p>
        </div>

        {/* Import Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            icon={<Upload size={18} />}
            onClick={() => {
              setModalOpen('csv')
              setCsvError(null)
            }}
          >
            Importar CSV
          </Button>
          <Button
            variant="secondary"
            icon={<Search size={18} />}
            onClick={() => {
              setModalOpen('search')
              setSearchError(null)
              setSearchResults([])
            }}
          >
            Buscar na Web
          </Button>
        </div>

        {/* Material Selection */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Selecione um texto ({currentMaterial + 1} de {materials.length})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
            {materials.map((material, index) => (
              <Card
                key={material.id}
                hoverable
                className={`p-6 cursor-pointer transition-all relative group ${
                  index === currentMaterial
                    ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-dark-700'
                    : ''
                }`}
                onClick={() => setCurrentMaterial(index)}
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 pr-8">
                  {material.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{material.wordCount} words</span>
                  <span>~{material.estimatedReadingTime} min</span>
                  <span className="px-2 py-1 rounded bg-gray-100 dark:bg-dark-800 capitalize">
                    {material.difficulty}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteMaterial(material.id)
                  }}
                  className="absolute top-2 right-2 p-2 rounded text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Deletar"
                >
                  <Trash2 size={16} />
                </button>
              </Card>
            ))}
          </div>
        </div>

        {/* Reading Panel */}
        <ReadingPanel material={materials[currentMaterial]} />

        {/* Learning Tips */}
        <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800">
          <div className="flex items-center gap-3 mb-6">
            <BookMarked size={28} className="text-primary-600 dark:text-primary-400" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Estratégias de Leitura
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">📖 Antes de Ler</p>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Leia o título e primeiras linhas</li>
                <li>• Preveja sobre o que é o texto</li>
                <li>• Defina um objetivo para leitura</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">👀 Durante a Leitura</p>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Leia ativamente e anote</li>
                <li>• Procure palavras desconhecidas</li>
                <li>• Faça perguntas a si mesmo</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">✓ Após a Leitura</p>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Resuma os pontos principais</li>
                <li>• Responda às perguntas</li>
                <li>• Reflita sobre aprendizado</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* CSV Import Modal */}
      {modalOpen === 'csv' && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setModalOpen(null)
              setCsvError(null)
            }}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 bg-white dark:bg-dark-800 rounded-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Importar de CSV</h3>
              <button
                onClick={() => {
                  setModalOpen(null)
                  setCsvError(null)
                }}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>Formato:</strong> CSV com colunas: <code>title, content, difficulty</code>
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-300 mt-2">
                  Dificuldade: beginner, intermediate, advanced
                </p>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleCSVUpload(e.target.files[0])
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700 cursor-pointer"
                />
              </div>

              {csvError && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle
                    className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                    size={16}
                  />
                  <p className="text-sm text-red-700 dark:text-red-300">{csvError}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Web Search Modal */}
      {modalOpen === 'search' && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setModalOpen(null)
              setSearchError(null)
              setSearchResults([])
            }}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 bg-white dark:bg-dark-800 rounded-xl shadow-2xl flex flex-col max-h-96">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Buscar na Web</h3>
              <button
                onClick={() => {
                  setModalOpen(null)
                  setSearchError(null)
                  setSearchResults([])
                }}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-3 border-b border-gray-200 dark:border-dark-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Ex: Technology, Climate Change..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={searchLoading}
                  icon={
                    searchLoading ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Search size={18} />
                    )
                  }
                >
                  {searchLoading ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>

              {searchError && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle
                    className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                    size={16}
                  />
                  <p className="text-sm text-red-700 dark:text-red-300">{searchError}</p>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              {searchResults.length === 0 && !searchLoading && !searchError && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Nenhuma busca realizada
                </p>
              )}
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-dark-700 hover:bg-primary-50 dark:hover:bg-dark-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                        {result.extract}
                      </p>
                    </div>
                    <button
                      onClick={() => handleFetchArticle(result.title)}
                      disabled={fetchingArticle}
                      className="p-1.5 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 flex-shrink-0 disabled:opacity-50"
                      title="Adicionar"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export default ReadingPage
