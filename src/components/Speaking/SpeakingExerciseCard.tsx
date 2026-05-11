'use client'

import React, { useState, useRef, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Mic, Volume2, RotateCcw, AlertTriangle } from 'lucide-react'
import { SpeakingExercise } from '@/types'
import {
  getSpeechRecognitionCtor,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speak,
  SpeechRecognitionLike,
} from '@/lib/speech'

interface SpeakingExerciseCardProps {
  exercise: SpeakingExercise
  onSubmit: (transcript: string, durationMs: number) => void
}

const SpeakingExerciseCard: React.FC<SpeakingExerciseCardProps> = ({ exercise, onSubmit }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [supported, setSupported] = useState(true)
  const [speaking, setSpeaking] = useState(false)

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const startTimeRef = useRef<number>(0)
  const durationRef = useRef<number>(0)

  useEffect(() => {
    setSupported(isSpeechRecognitionSupported())
  }, [])

  useEffect(() => {
    setTranscript('')
    setInterim('')
    setError(null)
    durationRef.current = 0
  }, [exercise.id])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {
          // ignore
        }
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const startRecording = () => {
    setError(null)
    setTranscript('')
    setInterim('')

    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setError('Reconhecimento de voz não suportado neste navegador. Use o Chrome ou Edge.')
      return
    }

    const recognition = new Ctor()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      let finalText = ''
      let interimText = ''
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript + ' '
        } else {
          interimText += result[0].transcript
        }
      }
      setTranscript(finalText.trim())
      setInterim(interimText.trim())
    }

    recognition.onerror = (event) => {
      const map: Record<string, string> = {
        'not-allowed': 'Permissão de microfone negada. Habilite nas configurações do navegador.',
        'permission-denied': 'Permissão de microfone negada.',
        'no-speech': 'Nenhuma fala detectada.',
        'audio-capture': 'Microfone não encontrado.',
        network: 'Erro de rede no reconhecimento de voz.',
      }
      setError(map[event.error] || `Erro no reconhecimento: ${event.error}`)
      setIsRecording(false)
    }

    recognition.onend = () => {
      durationRef.current = Date.now() - startTimeRef.current
      setIsRecording(false)
    }

    try {
      startTimeRef.current = Date.now()
      recognition.start()
      recognitionRef.current = recognition
      setIsRecording(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao iniciar gravação')
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        // ignore
      }
    }
  }

  const playTargetAudio = () => {
    if (!isSpeechSynthesisSupported()) {
      setError('Síntese de voz não disponível neste navegador.')
      return
    }
    setSpeaking(true)
    speak(exercise.targetPhrase, 'en-US', 0.9)
    const utterance = window.speechSynthesis
    const checkDone = setInterval(() => {
      if (!utterance.speaking) {
        setSpeaking(false)
        clearInterval(checkDone)
      }
    }, 200)
  }

  const handleReset = () => {
    setTranscript('')
    setInterim('')
    setError(null)
    durationRef.current = 0
  }

  const handleSubmit = () => {
    if (!transcript.trim()) return
    onSubmit(transcript.trim(), durationRef.current || Date.now() - startTimeRef.current)
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    advanced: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
  }

  return (
    <Card className="p-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {exercise.title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColors[exercise.difficulty]}`}
            >
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{exercise.description}</p>
        </div>

        {/* Browser support warning */}
        {!supported && (
          <div className="bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Navegador sem suporte ao reconhecimento de voz
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                Use o Google Chrome ou Microsoft Edge para gravar e analisar sua fala.
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">📝 Instructions</p>
          <p className="text-sm text-blue-800 dark:text-blue-300">{exercise.instructions}</p>
        </div>

        {/* Target Phrase */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800 rounded-lg p-6 border border-primary-200 dark:border-primary-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Target Phrase</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {exercise.targetPhrase}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={playTargetAudio}
            icon={<Volume2 size={18} />}
            disabled={speaking}
          >
            {speaking ? 'Reproduzindo...' : 'Listen'}
          </Button>
        </div>

        {/* Recording Section */}
        <div className="space-y-4">
          <div className="flex gap-4">
            {!isRecording ? (
              <Button
                variant="primary"
                size="lg"
                onClick={startRecording}
                icon={<Mic size={20} />}
                className="flex-1"
                disabled={!supported}
              >
                {transcript ? 'Re-record' : 'Start Recording'}
              </Button>
            ) : (
              <Button variant="danger" size="lg" onClick={stopRecording} className="flex-1">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                Stop Recording
              </Button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {(transcript || interim) && (
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {isRecording ? 'Capturando sua fala...' : 'Sua transcrição:'}
              </p>
              <p className="text-base text-gray-900 dark:text-white italic">
                "{transcript}
                {interim && (
                  <span className="text-gray-400 dark:text-gray-500"> {interim}</span>
                )}
                "
              </p>
              {!isRecording && transcript && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleReset}
                    icon={<RotateCcw size={18} />}
                    className="flex-1"
                  >
                    Limpar
                  </Button>
                  <Button variant="primary" size="md" onClick={handleSubmit} className="flex-1">
                    Submit for Analysis
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default SpeakingExerciseCard
