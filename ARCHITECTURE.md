# EnglishCanvas - Architecture Documentation

## Project Overview

EnglishCanvas is a modern, AI-powered English learning platform built with Next.js, React, and TypeScript. It provides a comprehensive learning experience with multiple modules for speaking, listening, reading, writing, and vocabulary acquisition.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Components**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion
- **Charts**: Chart.js + React ChartJS 2

### Backend (Suggested)
- **Runtime**: Node.js
- **API**: RESTful API with Express.js or Fastify
- **Database**: PostgreSQL or Firebase Firestore
- **Real-time**: WebSocket for live tutoring
- **Authentication**: JWT or Firebase Auth

### AI & APIs
- **Language Model**: Google Gemini API
- **Speech-to-Text**: Google Cloud Speech-to-Text API
- **Text-to-Speech**: Google Cloud Text-to-Speech API
- **Translation**: Google Translate API
- **Grammar Check**: Languagetool API or custom ML model

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   ├── dashboard/
│   │   └── page.tsx             # Dashboard
│   ├── speaking/
│   │   └── page.tsx             # Speaking module
│   ├── listening/
│   │   └── page.tsx             # Listening module
│   ├── reading/
│   │   └── page.tsx             # Reading module
│   ├── writing/
│   │   └── page.tsx             # Writing module
│   ├── vocabulary/
│   │   └── page.tsx             # Vocabulary module
│   ├── flashcards/
│   │   └── page.tsx             # Flashcards module
│   └── tutor/
│       └── page.tsx             # AI Tutor
│
├── components/                   # Reusable React components
│   ├── Button.tsx               # Button component
│   ├── Card.tsx                 # Card component
│   ├── Layout.tsx               # Main layout with sidebar
│   ├── Dashboard/
│   │   ├── ProgressCard.tsx
│   │   └── ModuleCard.tsx
│   ├── Speaking/
│   │   └── SpeakingExerciseCard.tsx
│   ├── Writing/
│   │   └── WritingEditor.tsx
│   ├── Reading/
│   │   └── ReadingPanel.tsx
│   ├── Listening/
│   │   └── ListeningPlayer.tsx
│   └── Flashcards/
│       └── FlashcardView.tsx
│
├── store/                        # Zustand stores
│   ├── useAuthStore.ts          # Authentication state
│   └── useLearningStore.ts      # Learning progress state
│
├── types/                        # TypeScript type definitions
│   └── index.ts                 # All type definitions
│
├── lib/                          # Utility functions and services
│   ├── api/                     # API integration
│   ├── services/                # Business logic services
│   └── utils/                   # Helper functions
│
├── styles/                       # Global styles
│   └── globals.css              # Tailwind imports and custom CSS
│
└── config/                       # Configuration files
    ├── next.config.js           # Next.js config
    ├── tsconfig.json            # TypeScript config
    ├── tailwind.config.js       # Tailwind config
    └── postcss.config.js        # PostCSS config
```

## Database Schema (PostgreSQL/Firebase)

### Users Collection
```typescript
{
  id: string (UUID)
  email: string (unique)
  name: string
  avatar: string (URL)
  passwordHash: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  joinedAt: timestamp
  lastLoginAt: timestamp
  preferences: {
    darkMode: boolean
    notificationsEnabled: boolean
    language: string
  }
}
```

### LearningProgress Collection
```typescript
{
  id: string
  userId: string (FK)
  totalMinutesStudied: number
  currentStreak: number
  longestStreak: number
  lastStudyDate: timestamp
  weeklyGoal: number
  weeklyProgress: number
  xp: number
  achievements: Achievement[]
  updatedAt: timestamp
}
```

### Speaking Exercises Collection
```typescript
{
  id: string
  title: string
  description: string
  targetPhrase: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  audioUrl: string
  instructions: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### SpeakingResults Collection
```typescript
{
  id: string
  userId: string (FK)
  exerciseId: string (FK)
  userAudioUrl: string
  transcription: string
  accuracy: number (0-100)
  pronunciation: number (0-100)
  fluency: number (0-100)
  feedback: string[]
  submittedAt: timestamp
}
```

### Flashcards Collection
```typescript
{
  id: string
  userId: string (FK)
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  reviewCount: number
  correctCount: number
  ease: number (1.3 - 2.5, for SM-2 algorithm)
  lastReviewDate: timestamp
  nextReviewDate: timestamp
  createdAt: timestamp
}
```

### WritingSubmissions Collection
```typescript
{
  id: string
  userId: string (FK)
  exerciseId: string (FK)
  content: string
  corrections: GrammarCorrection[]
  score: number (0-100)
  submittedAt: timestamp
}
```

### ReadingMaterials Collection
```typescript
{
  id: string
  title: string
  content: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  wordCount: number
  estimatedReadingTime: number (minutes)
  vocabulary: VocabularyItem[]
  comprehensionQuestions: Question[]
  createdAt: timestamp
}
```

### VocabularyItems Collection
```typescript
{
  id: string
  word: string
  pronunciation: string
  definition: string
  example: string
  partOfSpeech: string
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  imageUrl: string (optional)
  audioUrl: string (optional)
  synonyms: string[]
  category: string
  createdAt: timestamp
}
```

### AITutorSessions Collection
```typescript
{
  id: string
  userId: string (FK)
  mode: 'conversation' | 'interview' | 'grammar' | 'vocabulary'
  startedAt: timestamp
  endedAt: timestamp (optional)
  messages: AIMessage[]
  score: number (optional, for interview mode)
  duration: number (seconds)
}
```

## Component Architecture

### Base Components
- **Button**: Variants (primary, secondary, outline, ghost, danger), sizes (sm, md, lg)
- **Card**: Variants (default, elevated, outlined), hoverable option
- **Layout**: Main app layout with sidebar and header

### Module Components
- **Dashboard**: Progress tracking, module overview, achievements
- **Speaking**: Audio recording, real-time feedback, pronunciation analysis
- **Writing**: Rich text editor, grammar checking, suggestion panel
- **Reading**: Interactive text with vocabulary tooltips, comprehension questions
- **Listening**: Audio player, comprehension questions, subtitle support
- **Flashcards**: Flip card animation, spaced repetition algorithm
- **AI Tutor**: Chat interface, contextual responses, mode selection

## State Management (Zustand)

### useAuthStore
- User authentication state
- Profile information
- Authentication actions (setUser, logout)

### useLearningStore
- Learning progress tracking
- Daily activities
- Selected module
- XP and streak management

## API Integration Strategy

### Backend Endpoints

```
Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh

User Profile
GET    /api/users/:id
PUT    /api/users/:id
GET    /api/users/:id/progress

Speaking
GET    /api/speaking/exercises
POST   /api/speaking/submit
GET    /api/speaking/results/:id

Writing
GET    /api/writing/exercises
POST   /api/writing/submit
GET    /api/writing/feedback/:id

Reading
GET    /api/reading/materials
GET    /api/reading/materials/:id

Listening
GET    /api/listening/exercises

Flashcards
GET    /api/flashcards
POST   /api/flashcards
PUT    /api/flashcards/:id
POST   /api/flashcards/sessions
POST   /api/flashcards/sessions/:id/results

Vocabulary
GET    /api/vocabulary/words
GET    /api/vocabulary/categories

AI Tutor
POST   /api/tutor/sessions
POST   /api/tutor/sessions/:id/messages
GET    /api/tutor/sessions/:id

Analytics
GET    /api/analytics/progress
GET    /api/analytics/stats
```

## Key Features Implementation

### 1. Speaking Module
- Uses Web Audio API for recording
- Sends audio to Google Speech-to-Text API
- Analyzes pronunciation using Gemini API
- Returns feedback on accuracy, fluency, and pronunciation

### 2. Writing Module
- Real-time grammar checking with Languagetool API
- AI-powered suggestions using Gemini API
- Tracks writing statistics (word count, readability)
- Maintains version history

### 3. Reading Module
- Interactive vocabulary with hover definitions
- Text-to-speech for pronunciation
- Comprehension questions with explanation
- Adjustable font size

### 4. Listening Module
- Audio player with playback controls
- Adjustable playback speed
- Subtitle synchronization
- Comprehension questions

### 5. Flashcards
- Implements SM-2 (Spaced Repetition) algorithm
- Tracks ease factor and review intervals
- Calculates next review date automatically
- Category-based organization

### 6. AI Tutor
- Uses Gemini API for natural language understanding
- Context-aware responses
- Multiple conversation modes
- Error correction and explanation

## Performance Optimization

### Frontend
- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image component
- CSS-in-JS with Tailwind CSS for minimal bundle
- Lazy loading of modules and components

### Backend
- Database indexing on frequently queried fields
- Caching with Redis for API responses
- Pagination for large result sets
- CDN for static assets and audio files

## Security

### Authentication & Authorization
- JWT tokens with secure httpOnly cookies
- Rate limiting on API endpoints
- CORS configuration for trusted domains
- SQL injection prevention with parameterized queries

### Data Protection
- HTTPS/TLS encryption
- User data encryption at rest
- GDPR compliance for user data
- Regular security audits

## Deployment

### Hosting Options
- **Frontend**: Vercel (recommended for Next.js)
- **Backend**: AWS EC2, Google Cloud Run, or Heroku
- **Database**: AWS RDS, Google Cloud SQL, or Firebase
- **Storage**: AWS S3 or Google Cloud Storage for audio/files

### Environment Variables
```
NEXT_PUBLIC_API_URL=https://api.englishcanvas.com
NEXT_PUBLIC_GEMINI_API_KEY=xxx
GOOGLE_CLOUD_SPEECH_API_KEY=xxx
DATABASE_URL=postgres://...
JWT_SECRET=xxx
STRIPE_KEY=xxx (for payments)
```

## Monitoring & Analytics

- Error tracking with Sentry
- Performance monitoring with Web Vitals
- User analytics with Mixpanel or Google Analytics
- Server-side logging with Winston or Bunyan

## Future Enhancements

1. **Mobile App**: React Native version
2. **Real-time Collaboration**: Study groups and peer learning
3. **Advanced Analytics**: ML-based learning recommendations
4. **Certification**: Generate certificates upon completion
5. **Community**: Discussion forums and language exchange
6. **Gamification**: Leaderboards, tournaments, and daily challenges
7. **Content Library**: Partnership with content creators
8. **Accessibility**: Screen reader support, keyboard navigation
9. **Offline Mode**: Progressive Web App (PWA)
10. **Integration**: Slack, Teams, Notion integration

## Development Workflow

### Local Setup
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Run tests
npm test

# Build production
npm run build
npm start
```

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Jest for unit testing
- Playwright for E2E testing
