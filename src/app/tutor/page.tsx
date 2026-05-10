'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Send, Loader, MessageCircle } from 'lucide-react'

const TutorPage = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your AI English tutor. I can help you with grammar, vocabulary, conversation practice, and much more. What would you like to learn today?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tutorMode, setTutorMode] = useState<'conversation' | 'grammar' | 'interview' | null>(null)

  const modes = [
    {
      id: 'conversation',
      title: 'Free Conversation',
      description: 'Have a natural conversation on any topic',
      icon: '💬',
    },
    {
      id: 'grammar',
      title: 'Grammar Tutor',
      description: 'Learn and practice English grammar',
      icon: '📚',
    },
    {
      id: 'interview',
      title: 'Interview Practice',
      description: 'Practice for job interviews',
      icon: '💼',
    },
  ]

  const handleSendMessage = async () => {
    if (!input.trim()) return

    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const responses: { [key: string]: string[] } = {
        conversation: [
          'That\'s an interesting point! Can you tell me more about that?',
          'I see. Let me help you improve that sentence...',
          'Good! Your grammar was correct. Next time try using more advanced vocabulary.',
        ],
        grammar: [
          'This sentence has an error. The correct form would be: "I have been learning English for 5 years."',
          'Excellent! You used the present perfect tense correctly.',
          'Remember: We use "have been" + gerund for actions that started in the past and continue to the present.',
        ],
        interview: [
          'Great answer! Now, tell me about a time when you had to deal with a difficult situation at work.',
          'Perfect! Your response showed great problem-solving skills. Let me ask you another question...',
          'That was well explained. In an interview, try to keep your answer between 2-3 minutes.',
        ],
      }

      const modeKey = tutorMode || 'conversation'
      const randomResponse = responses[modeKey][Math.floor(Math.random() * responses[modeKey].length)]

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: randomResponse },
      ])
      setIsLoading(false)
    }, 1500)
  }

  if (!tutorMode) {
    return (
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">AI Tutor 🤖</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Practice English with an intelligent AI tutor available 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modes.map((mode) => (
              <Card
                key={mode.id}
                hoverable
                className="p-8 cursor-pointer transition-all"
                onClick={() => setTutorMode(mode.id as any)}
              >
                <p className="text-5xl mb-4">{mode.icon}</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {mode.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {mode.description}
                </p>
              </Card>
            ))}
          </div>

          <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What Our AI Tutor Can Do
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <p className="text-2xl">✓</p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Correct Your Mistakes</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Get detailed explanations of grammar and vocabulary errors
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <p className="text-2xl">✓</p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Adapt to Your Level</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Adjust difficulty and topics based on your progress
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <p className="text-2xl">✓</p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Natural Conversations</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Chat naturally on topics relevant to your goals
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <p className="text-2xl">✓</p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Practice Scenarios</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Simulate real-life situations like interviews
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {modes.find((m) => m.id === tutorMode)?.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Powered by advanced AI
            </p>
          </div>
          <Button variant="outline" onClick={() => setTutorMode(null)}>
            Change Mode
          </Button>
        </div>

        {/* Chat Area */}
        <Card className="flex-1 p-6 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md rounded-lg p-4 ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white rounded-lg p-4 flex items-center gap-2">
                  <Loader size={18} className="animate-spin" />
                  <span>Tutor is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              icon={<Send size={18} />}
            />
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <MessageCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-200 mb-2">💡 Tips for Better Learning</p>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Ask for corrections when unsure</li>
                <li>• Request explanations of grammatical concepts</li>
                <li>• Use complete sentences to maximize learning</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default TutorPage
