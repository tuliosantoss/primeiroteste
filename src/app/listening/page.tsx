'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  ChevronLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react'
import {
  DialogueLine,
  isSpeechSynthesisSupported,
  playDialogue,
  SequencePlayer,
} from '@/lib/speech'

interface ListeningQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
}

interface ListeningExerciseFull {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  dialogue: DialogueLine[]
  questions: ListeningQuestion[]
}

const exercises: ListeningExerciseFull[] = [
  {
    id: '1',
    title: 'Restaurant Dialogue',
    description: 'Um cliente faz seu pedido em um restaurante casual',
    difficulty: 'beginner',
    dialogue: [
      {
        speaker: 'Waiter',
        pitch: 0.85,
        text: 'Good evening! Welcome to our restaurant. Can I get you something to drink?',
      },
      {
        speaker: 'Customer',
        pitch: 1.15,
        text: "Hi! I'll have a glass of water with lemon, please.",
      },
      {
        speaker: 'Waiter',
        pitch: 0.85,
        text: 'Sure thing. Are you ready to order, or do you need a few minutes?',
      },
      {
        speaker: 'Customer',
        pitch: 1.15,
        text: "I think I'll have the chicken pasta. Is it spicy?",
      },
      {
        speaker: 'Waiter',
        pitch: 0.85,
        text: 'Just a little bit, but I can ask the chef to make it mild for you.',
      },
      {
        speaker: 'Customer',
        pitch: 1.15,
        text: 'That would be perfect. Thank you.',
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'O que o cliente pediu para beber?',
        options: ['Café', 'Água com limão', 'Suco de laranja', 'Refrigerante'],
        correctAnswer: 'Água com limão',
      },
      {
        id: 'q2',
        question: 'Qual prato o cliente escolheu?',
        options: ['Macarrão com frango', 'Bife', 'Salada de vegetais', 'Sopa de peixe'],
        correctAnswer: 'Macarrão com frango',
      },
      {
        id: 'q3',
        question: 'Como o prato será preparado em relação ao tempero?',
        options: ['Bem picante', 'Apimentado', 'Suave', 'Sem tempero algum'],
        correctAnswer: 'Suave',
      },
    ],
  },
  {
    id: '2',
    title: 'Job Interview',
    description: 'Simulação de uma entrevista de emprego para uma vaga de tecnologia',
    difficulty: 'intermediate',
    dialogue: [
      {
        speaker: 'Interviewer',
        pitch: 0.95,
        text: 'Thanks for coming in today. Could you tell me a little about your background?',
      },
      {
        speaker: 'Candidate',
        pitch: 1.1,
        text: 'Of course. I have five years of experience as a software developer, mainly working with web applications.',
      },
      {
        speaker: 'Interviewer',
        pitch: 0.95,
        text: 'Interesting. What attracted you to apply for this position?',
      },
      {
        speaker: 'Candidate',
        pitch: 1.1,
        text: 'I really admire your engineering culture, and I want to work on products that have a real impact on users.',
      },
      {
        speaker: 'Interviewer',
        pitch: 0.95,
        text: 'Great. And where do you see yourself in three years?',
      },
      {
        speaker: 'Candidate',
        pitch: 1.1,
        text: 'I would like to grow into a technical leadership role, mentoring other engineers and shaping architecture decisions.',
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'Quantos anos de experiência o candidato tem?',
        options: ['Três anos', 'Cinco anos', 'Sete anos', 'Dez anos'],
        correctAnswer: 'Cinco anos',
      },
      {
        id: 'q2',
        question: 'Em qual área o candidato trabalhou principalmente?',
        options: [
          'Aplicações web',
          'Aplicativos móveis',
          'Inteligência artificial',
          'Banco de dados',
        ],
        correctAnswer: 'Aplicações web',
      },
      {
        id: 'q3',
        question: 'Por que o candidato se interessou pela vaga?',
        options: [
          'Pelo salário',
          'Pela localização',
          'Pela cultura de engenharia e impacto nos usuários',
          'Pelos benefícios',
        ],
        correctAnswer: 'Pela cultura de engenharia e impacto nos usuários',
      },
      {
        id: 'q4',
        question: 'Onde o candidato se vê em três anos?',
        options: [
          'Trabalhando em outro país',
          'Em uma posição de liderança técnica',
          'Em sua própria empresa',
          'Em outra área de tecnologia',
        ],
        correctAnswer: 'Em uma posição de liderança técnica',
      },
    ],
  },
  {
    id: '3',
    title: 'Podcast Discussion',
    description: 'Um trecho de podcast sobre o impacto da tecnologia na educação',
    difficulty: 'advanced',
    dialogue: [
      {
        speaker: 'Host',
        pitch: 1.0,
        text: 'Today we are discussing how technology has transformed modern education. Sarah, what do you think is the biggest change?',
      },
      {
        speaker: 'Sarah',
        pitch: 1.2,
        text: 'I believe personalized learning is the most significant shift. Algorithms can now adapt content to each student in real time.',
      },
      {
        speaker: 'Host',
        pitch: 1.0,
        text: 'And what about the downsides? Are there any concerns we should highlight?',
      },
      {
        speaker: 'Sarah',
        pitch: 1.2,
        text: 'Absolutely. There is growing concern about screen time, reduced face-to-face interaction, and the digital divide between students.',
      },
      {
        speaker: 'Host',
        pitch: 1.0,
        text: 'Interesting. Do you think traditional classrooms will disappear in the next decade?',
      },
      {
        speaker: 'Sarah',
        pitch: 1.2,
        text: 'Not entirely. I think we will see a hybrid model where technology supports teachers rather than replacing them.',
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'Segundo Sarah, qual é a maior mudança trazida pela tecnologia?',
        options: [
          'Aulas online gratuitas',
          'Aprendizado personalizado',
          'Provas digitais',
          'Salas de aula remotas',
        ],
        correctAnswer: 'Aprendizado personalizado',
      },
      {
        id: 'q2',
        question: 'Qual NÃO foi uma preocupação levantada por Sarah?',
        options: [
          'Tempo de tela',
          'Menos interação presencial',
          'Custo da tecnologia',
          'Divisão digital entre alunos',
        ],
        correctAnswer: 'Custo da tecnologia',
      },
      {
        id: 'q3',
        question: 'Qual é a visão de Sarah sobre as salas de aula tradicionais?',
        options: [
          'Vão desaparecer em uma década',
          'Vão se tornar totalmente digitais',
          'Vão coexistir com a tecnologia em um modelo híbrido',
          'Vão permanecer exatamente iguais',
        ],
        correctAnswer: 'Vão coexistir com a tecnologia em um modelo híbrido',
      },
    ],
  },
]

const difficultyStyles: Record<ListeningExerciseFull['difficulty'], string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  advanced: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
}

const difficultyLabel: Record<ListeningExerciseFull['difficulty'], string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
}

const ListeningPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [playerState, setPlayerState] = useState<'idle' | 'playing' | 'paused' | 'done'>('idle')
  const [currentLine, setCurrentLine] = useState<number>(-1)
  const [showTranscript, setShowTranscript] = useState(false)
  const [player, setPlayer] = useState<SequencePlayer | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [synthesisError, setSynthesisError] = useState<string | null>(null)
  const [synthesisSupported, setSynthesisSupported] = useState(true)

  const selected = useMemo(
    () => exercises.find((e) => e.id === selectedId) || null,
    [selectedId]
  )

  useEffect(() => {
    setSynthesisSupported(isSpeechSynthesisSupported())
  }, [])

  useEffect(() => {
    return () => {
      if (player) player.cancel()
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [player])

  const resetExerciseState = () => {
    if (player) player.cancel()
    setPlayer(null)
    setPlayerState('idle')
    setCurrentLine(-1)
    setShowTranscript(false)
    setAnswers({})
    setSubmitted(false)
    setSynthesisError(null)
  }

  const selectExercise = (id: string) => {
    resetExerciseState()
    setSelectedId(id)
  }

  const backToList = () => {
    resetExerciseState()
    setSelectedId(null)
  }

  const handlePlay = () => {
    if (!selected) return
    if (!synthesisSupported) {
      setSynthesisError('Seu navegador não suporta síntese de voz. Use o Chrome ou Edge.')
      return
    }

    setSynthesisError(null)
    setPlayerState('playing')
    setCurrentLine(0)

    const newPlayer = playDialogue(selected.dialogue, {
      onLineChange: (idx) => setCurrentLine(idx),
      onComplete: () => {
        setPlayerState('done')
        setCurrentLine(-1)
      },
      onError: (err) => {
        setSynthesisError(err)
        setPlayerState('idle')
      },
    })
    setPlayer(newPlayer)
  }

  const handlePause = () => {
    if (player) player.pause()
    setPlayerState('paused')
  }

  const handleResume = () => {
    if (player) player.resume()
    setPlayerState('playing')
  }

  const handleStop = () => {
    if (player) player.cancel()
    setPlayer(null)
    setPlayerState('idle')
    setCurrentLine(-1)
  }

  const handleRestart = () => {
    handleStop()
    setTimeout(() => handlePlay(), 50)
  }

  const handleAnswer = (questionId: string, option: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  const handleSubmitAnswers = () => {
    if (!selected) return
    if (Object.keys(answers).length < selected.questions.length) return
    setSubmitted(true)
  }

  const handleTryAgain = () => {
    setAnswers({})
    setSubmitted(false)
  }

  const score = useMemo(() => {
    if (!selected || !submitted) return null
    const correct = selected.questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length
    return {
      correct,
      total: selected.questions.length,
      percentage: Math.round((correct / selected.questions.length) * 100),
    }
  }, [selected, answers, submitted])

  // ─── LIST VIEW ─────────────────────────────────────────────────────────
  if (!selected) {
    return (
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Listening Practice 👂
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Treine sua compreensão auditiva com diálogos reais e perguntas
            </p>
          </div>

          {!synthesisSupported && (
            <div className="bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle
                className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Navegador sem suporte completo
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                  A síntese de voz pode não funcionar. Recomendamos Chrome ou Edge.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exercises.map((exercise) => {
              const totalWords = exercise.dialogue.reduce(
                (sum, line) => sum + line.text.split(' ').length,
                0
              )
              const estimatedSec = Math.round(totalWords / 2.5) // ~150 wpm
              return (
                <Card
                  key={exercise.id}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => selectExercise(exercise.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {exercise.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyStyles[exercise.difficulty]}`}
                    >
                      {difficultyLabel[exercise.difficulty]}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {exercise.description}
                  </p>

                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 mb-6">
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {Math.floor(estimatedSec / 60)}:
                      {(estimatedSec % 60).toString().padStart(2, '0')}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Duração · {exercise.questions.length} perguntas
                    </p>
                  </div>

                  <Button variant="primary" className="w-full" icon={<Play size={18} />}>
                    Iniciar Exercício
                  </Button>
                </Card>
              )
            })}
          </div>

          <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🎧 Dicas de escuta ativa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-2">
                  Não olhe a transcrição primeiro
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Desafie-se a entender sem ler o texto antes.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Anote pontos-chave</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Escreva palavras importantes enquanto ouve. Melhora foco e retenção.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Ouça várias vezes</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Primeiro para entender no geral, depois para captar detalhes.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

  // ─── DETAIL VIEW ───────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <button
          onClick={backToList}
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ChevronLeft size={16} />
          Voltar para a lista
        </button>

        <Card className="p-8">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {selected.title}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyStyles[selected.difficulty]}`}
            >
              {difficultyLabel[selected.difficulty]}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{selected.description}</p>

          {/* Player */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              {playerState === 'idle' && (
                <Button variant="primary" onClick={handlePlay} icon={<Play size={18} />}>
                  Reproduzir áudio
                </Button>
              )}
              {playerState === 'playing' && (
                <Button variant="primary" onClick={handlePause} icon={<Pause size={18} />}>
                  Pausar
                </Button>
              )}
              {playerState === 'paused' && (
                <Button variant="primary" onClick={handleResume} icon={<Play size={18} />}>
                  Continuar
                </Button>
              )}
              {playerState === 'done' && (
                <Button variant="primary" onClick={handleRestart} icon={<RotateCcw size={18} />}>
                  Ouvir novamente
                </Button>
              )}
              {(playerState === 'playing' || playerState === 'paused') && (
                <Button variant="ghost" onClick={handleStop} icon={<Square size={18} />}>
                  Parar
                </Button>
              )}
              {playerState === 'playing' && (
                <Button
                  variant="ghost"
                  onClick={handleRestart}
                  icon={<RotateCcw size={18} />}
                >
                  Reiniciar
                </Button>
              )}
              <button
                onClick={() => setShowTranscript((v) => !v)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-dark-600/50 rounded-lg transition-colors ml-auto"
              >
                {showTranscript ? <EyeOff size={16} /> : <Eye size={16} />}
                {showTranscript ? 'Ocultar transcrição' : 'Mostrar transcrição'}
              </button>
            </div>

            {synthesisError && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle
                  className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                  size={16}
                />
                <p className="text-sm text-red-700 dark:text-red-300">{synthesisError}</p>
              </div>
            )}

            {/* Active line */}
            {currentLine >= 0 && playerState !== 'idle' && playerState !== 'done' && (
              <div className="mt-4 p-4 bg-white dark:bg-dark-800 rounded-lg border-l-4 border-primary-500">
                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1">
                  {selected.dialogue[currentLine].speaker}
                </p>
                <p className="text-base text-gray-900 dark:text-white">
                  {selected.dialogue[currentLine].text}
                </p>
              </div>
            )}
          </div>

          {/* Transcript */}
          {showTranscript && (
            <div className="mb-6 space-y-3 p-5 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Transcrição completa
              </p>
              {selected.dialogue.map((line, idx) => (
                <div key={idx} className="flex gap-3">
                  <p className="text-sm font-bold text-primary-600 dark:text-primary-400 min-w-[100px]">
                    {line.speaker}:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{line.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Perguntas de compreensão
            </h3>

            {selected.questions.map((q, qIdx) => {
              const userAnswer = answers[q.id]
              const isCorrect = submitted && userAnswer === q.correctAnswer
              const isWrong = submitted && userAnswer && userAnswer !== q.correctAnswer

              return (
                <div key={q.id} className="space-y-3">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {qIdx + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const selectedOpt = userAnswer === opt
                      const correctOpt = submitted && opt === q.correctAnswer
                      const wrongSelected = submitted && selectedOpt && opt !== q.correctAnswer

                      return (
                        <button
                          key={opt}
                          onClick={() => handleAnswer(q.id, opt)}
                          disabled={submitted}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                            correctOpt
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-200'
                              : wrongSelected
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-200'
                                : selectedOpt
                                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-900 dark:text-primary-200'
                                  : 'border-gray-200 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-dark-700'
                          } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span className="text-sm">{opt}</span>
                          {correctOpt && (
                            <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />
                          )}
                          {wrongSelected && (
                            <XCircle size={18} className="text-red-600 dark:text-red-400" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                  {submitted && isWrong && (
                    <p className="text-xs text-red-600 dark:text-red-400 px-1">
                      Resposta correta: <strong>{q.correctAnswer}</strong>
                    </p>
                  )}
                  {submitted && isCorrect && (
                    <p className="text-xs text-green-600 dark:text-green-400 px-1">✓ Correto</p>
                  )}
                </div>
              )
            })}

            {!submitted ? (
              <Button
                variant="primary"
                className="w-full"
                onClick={handleSubmitAnswers}
                disabled={Object.keys(answers).length < selected.questions.length}
              >
                {Object.keys(answers).length < selected.questions.length
                  ? `Responda todas as ${selected.questions.length} perguntas`
                  : 'Verificar respostas'}
              </Button>
            ) : (
              <div className="space-y-3">
                <Card
                  className={`p-6 text-center ${
                    score && score.percentage >= 70
                      ? 'bg-green-50 dark:bg-green-900/30'
                      : 'bg-amber-50 dark:bg-amber-900/30'
                  }`}
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">Seu resultado</p>
                  <p
                    className={`text-4xl font-bold mt-2 ${
                      score && score.percentage >= 70
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {score?.correct}/{score?.total}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {score?.percentage}% de acerto
                  </p>
                </Card>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleTryAgain}
                  icon={<RotateCcw size={18} />}
                >
                  Tentar de novo
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default ListeningPage
