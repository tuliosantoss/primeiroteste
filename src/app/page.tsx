'use client'

import React from 'react'
import Link from 'next/link'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { ArrowRight, Zap, Award, Users, BarChart3 } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold">
            EC
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">EnglishCanvas</span>
        </div>

        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Master English with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">AI-Powered Learning</span>
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Learn English the smart way. From speaking and listening to reading and writing, our intelligent platform
          adapts to your learning style and accelerates your progress.
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Link href="/dashboard">
            <Button variant="primary" size="lg" icon={<ArrowRight size={20} />}>
              Start Free Trial
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">50K+</p>
            <p className="text-gray-600 dark:text-gray-400">Active Learners</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-secondary-600 dark:text-secondary-400">4.9★</p>
            <p className="text-gray-600 dark:text-gray-400">User Rating</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">89%</p>
            <p className="text-gray-600 dark:text-gray-400">Goal Achievement</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">24/7</p>
            <p className="text-gray-600 dark:text-gray-400">Available</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Everything You Need to Master English
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: '🎤',
              title: 'Speaking Practice',
              description: 'Get real-time feedback on pronunciation, fluency, and accuracy with AI-powered analysis.',
              href: '/speaking',
            },
            {
              icon: '👂',
              title: 'Listening Comprehension',
              description: 'Improve listening skills with authentic audio, podcasts, and interactive exercises.',
              href: '/listening',
            },
            {
              icon: '📖',
              title: 'Advanced Reading',
              description: 'Read materials at your level with vocabulary support and comprehension questions.',
              href: '/reading',
            },
            {
              icon: '✍️',
              title: 'Writing Mastery',
              description: 'Get detailed grammar and vocabulary corrections powered by advanced AI models.',
              href: '/writing',
            },
            {
              icon: '📚',
              title: 'Smart Vocabulary',
              description: 'Learn and retain vocabulary with spaced repetition and contextual examples.',
              href: '/vocabulary',
            },
            {
              icon: '🤖',
              title: 'AI Tutor',
              description: 'Have natural conversations with an AI tutor that adapts to your level and goals.',
              href: '/tutor',
            },
          ].map((feature, index) => (
            <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300">
              <p className="text-5xl mb-4">{feature.icon}</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{feature.description}</p>
              <Link href={feature.href}>
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Why Choose EnglishCanvas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {[
              {
                icon: <Zap size={32} />,
                title: 'Personalized Learning Path',
                description: 'Our AI learns your strengths and weaknesses to create a custom study plan just for you.',
              },
              {
                icon: <Award size={32} />,
                title: 'Gamification & Rewards',
                description: 'Earn points, badges, and streaks to stay motivated and celebrate your progress.',
              },
              {
                icon: <BarChart3 size={32} />,
                title: 'Detailed Analytics',
                description: 'Track your improvement with comprehensive statistics and insights about your learning.',
              },
              {
                icon: <Users size={32} />,
                title: 'Community Support',
                description: 'Connect with other learners, share tips, and practice together in our community.',
              },
            ].map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 text-primary-600 dark:text-primary-400">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Card className="p-8 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-800 flex items-center justify-center min-h-96">
            <div className="text-center">
              <p className="text-6xl mb-4">🚀</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Your English?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Join thousands of learners who are already achieving their English goals
              </p>
              <Link href="/dashboard">
                <Button variant="primary" size="lg">
                  Start Your Journey
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-dark-800 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-bold text-white mb-4">Product</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-4">Company</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-4">Connect</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition">Instagram</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2024 EnglishCanvas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
