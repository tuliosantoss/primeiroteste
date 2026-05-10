'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import ReadingPanel from '@/components/Reading/ReadingPanel'
import Card from '@/components/Card'
import { ReadingMaterial, VocabularyItem } from '@/types'
import { BookMarked } from 'lucide-react'

const ReadingPage = () => {
  const [currentMaterial, setCurrentMaterial] = useState(0)

  const vocabulary: VocabularyItem[] = [
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

  const materials: ReadingMaterial[] = [
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
      vocabulary: vocabulary,
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
      vocabulary: vocabulary,
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

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Reading Practice 📖</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Improve your comprehension and expand your vocabulary
          </p>
        </div>

        {/* Material Selection */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Select a reading material ({currentMaterial + 1} of {materials.length})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((material, index) => (
              <Card
                key={material.id}
                hoverable
                className={`p-6 cursor-pointer transition-all ${
                  index === currentMaterial
                    ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-dark-700'
                    : ''
                }`}
                onClick={() => setCurrentMaterial(index)}
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{material.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{material.wordCount} words</span>
                  <span>~{material.estimatedReadingTime} min</span>
                  <span className="px-2 py-1 rounded bg-gray-100 dark:bg-dark-800 capitalize">
                    {material.difficulty}
                  </span>
                </div>
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
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Reading Strategies</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">📖 Before Reading</p>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Preview the title and headings</li>
                <li>• Predict what the text is about</li>
                <li>• Set a purpose for reading</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">👀 While Reading</p>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Read actively and take notes</li>
                <li>• Look up unfamiliar words</li>
                <li>• Ask yourself questions</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">✓ After Reading</p>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Summarize the main points</li>
                <li>• Answer comprehension questions</li>
                <li>• Reflect on what you learned</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default ReadingPage
