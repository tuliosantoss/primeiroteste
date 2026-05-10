import React, { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Mic, Volume2, RotateCcw } from 'lucide-react'
import { SpeakingExercise } from '@/types'

interface SpeakingExerciseCardProps {
  exercise: SpeakingExercise
  onSubmit: (audioData: Blob) => void
}

const SpeakingExerciseCard: React.FC<SpeakingExerciseCardProps> = ({ exercise, onSubmit }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const audioChunks: BlobPart[] = []

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
        setRecordedAudio(audioBlob)
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  const playTargetAudio = () => {
    if (exercise.audioUrl) {
      const audio = new Audio(exercise.audioUrl)
      audio.play()
    }
  }

  const handleSubmit = () => {
    if (recordedAudio) {
      onSubmit(recordedAudio)
      setRecordedAudio(null)
    }
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
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{exercise.title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColors[exercise.difficulty]}`}>
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{exercise.description}</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">📝 Instructions</p>
          <p className="text-sm text-blue-800 dark:text-blue-300">{exercise.instructions}</p>
        </div>

        {/* Target Phrase */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800 rounded-lg p-6 border border-primary-200 dark:border-primary-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Target Phrase</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{exercise.targetPhrase}</p>
          {exercise.audioUrl && (
            <Button
              variant="primary"
              size="sm"
              onClick={playTargetAudio}
              icon={<Volume2 size={18} />}
            >
              Listen
            </Button>
          )}
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
              >
                Start Recording
              </Button>
            ) : (
              <Button
                variant="danger"
                size="lg"
                onClick={stopRecording}
                className="flex-1"
              >
                ⏹️ Stop Recording
              </Button>
            )}
          </div>

          {recordedAudio && (
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 space-y-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Recording</p>
              <audio
                src={URL.createObjectURL(recordedAudio)}
                controls
                className="w-full"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setRecordedAudio(null)}
                  icon={<RotateCcw size={18} />}
                  className="flex-1"
                >
                  Re-record
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmit}
                  className="flex-1"
                >
                  Submit for Analysis
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default SpeakingExerciseCard
