import type { Metadata } from 'next'
import { ReactNode } from 'react'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'EnglishCanvas - Learn English the Smart Way',
  description: 'Modern English Learning Platform with AI Tutoring, Speaking Practice, and Interactive Lessons',
  keywords: 'english learning, language learning, online education, IELTS, TOEFL, English fluency',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `}</style>
      </head>
      <body className="bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  )
}
