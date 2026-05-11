# Development Guide - EnglishCanvas

## Getting Started with Development

This guide provides detailed instructions for developing features in EnglishCanvas.

## Environment Setup

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/englishcanvas.git
cd englishcanvas
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env.local
# Edit .env.local with your API keys and database URL
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb englishcanvas

# Run migrations (when available)
npm run migrate

# Seed sample data
npm run seed
```

### 4. Start Development

```bash
npm run dev
# Opens http://localhost:3000
```

## Adding a New Learning Module

### Step 1: Create Type Definitions

Add new types to `src/types/index.ts`:

```typescript
export interface NewModuleExercise {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  content: string
  duration: number
}

export interface NewModuleResult {
  exerciseId: string
  userId: string
  score: number
  feedback: string
  submittedAt: Date
}
```

### Step 2: Create Component

Create `src/components/NewModule/ExerciseComponent.tsx`:

```typescript
import React from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { NewModuleExercise } from '@/types'

interface ExerciseComponentProps {
  exercise: NewModuleExercise
  onSubmit: (result: any) => void
}

const ExerciseComponent: React.FC<ExerciseComponentProps> = ({ exercise, onSubmit }) => {
  const handleSubmit = () => {
    // Handle exercise submission
    onSubmit({ exerciseId: exercise.id, score: 85 })
  }

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold mb-4">{exercise.title}</h2>
      <p className="text-gray-600 mb-6">{exercise.description}</p>
      
      {/* Exercise content */}
      <div className="space-y-4 mb-6">
        {/* Add interactive content here */}
      </div>

      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Card>
  )
}

export default ExerciseComponent
```

### Step 3: Create Page

Create `src/app/newmodule/page.tsx`:

```typescript
'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import ExerciseComponent from '@/components/NewModule/ExerciseComponent'
import Card from '@/components/Card'

const NewModulePage = () => {
  const [currentExercise, setCurrentExercise] = useState(0)

  const exercises = [
    {
      id: '1',
      title: 'Exercise 1',
      description: 'First exercise',
      difficulty: 'beginner',
      content: 'Content here',
      duration: 300,
    },
  ]

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            New Module 📚
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Description of the module
          </p>
        </div>

        <ExerciseComponent
          exercise={exercises[currentExercise]}
          onSubmit={(result) => console.log(result)}
        />
      </div>
    </Layout>
  )
}

export default NewModulePage
```

## Integrating External APIs

### Google Cloud Speech-to-Text

Create `src/lib/services/speech.service.ts`:

```typescript
import axios from 'axios'

export class SpeechService {
  private apiKey = process.env.NEXT_PUBLIC_GOOGLE_SPEECH_API_KEY

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const base64Audio = await this.blobToBase64(audioBlob)

    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${this.apiKey}`,
      {
        config: {
          encoding: 'AUDIO_CONTENT',
          languageCode: 'en-US',
        },
        audio: {
          content: base64Audio,
        },
      }
    )

    return response.data.results
      ?.map((result: any) => result.alternatives[0].transcript)
      .join(' ') || ''
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
}

export const speechService = new SpeechService()
```

### Using the Service

```typescript
import { speechService } from '@/lib/services/speech.service'

const handleAudioSubmit = async (audioBlob: Blob) => {
  const transcription = await speechService.transcribeAudio(audioBlob)
  console.log('Transcribed text:', transcription)
}
```

### Gemini API for AI Features

Create `src/lib/services/gemini.service.ts`:

```typescript
import axios from 'axios'

export class GeminiService {
  private apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

  async generateFeedback(text: string, context: string): Promise<string> {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${context}\n\nUser text: "${text}"\n\nProvide constructive feedback.`,
              },
            ],
          },
        ],
      }
    )

    return response.data.candidates[0].content.parts[0].text
  }

  async correctGrammar(text: string): Promise<{ corrected: string; explanation: string }> {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Correct the grammar in this text and explain the changes:\n"${text}"`,
              },
            ],
          },
        ],
      }
    )

    const content = response.data.candidates[0].content.parts[0].text
    return { corrected: content, explanation: 'See above for details' }
  }
}

export const geminiService = new GeminiService()
```

## State Management with Zustand

### Creating a New Store

Create `src/store/useNewModuleStore.ts`:

```typescript
import { create } from 'zustand'

interface NewModuleState {
  currentExercise: string | null
  completedExercises: string[]
  score: number

  setCurrentExercise: (id: string) => void
  addCompletedExercise: (id: string) => void
  updateScore: (score: number) => void
  reset: () => void
}

export const useNewModuleStore = create<NewModuleState>((set) => ({
  currentExercise: null,
  completedExercises: [],
  score: 0,

  setCurrentExercise: (id) => set({ currentExercise: id }),

  addCompletedExercise: (id) =>
    set((state) => ({
      completedExercises: [...state.completedExercises, id],
    })),

  updateScore: (score) => set({ score }),

  reset: () =>
    set({
      currentExercise: null,
      completedExercises: [],
      score: 0,
    }),
}))
```

### Using the Store

```typescript
import { useNewModuleStore } from '@/store/useNewModuleStore'

const MyComponent = () => {
  const { score, updateScore } = useNewModuleStore()

  const handleUpdate = () => {
    updateScore(85)
  }

  return <div>{score}</div>
}
```

## Backend API Integration

### Creating API Routes (if using Next.js API routes)

Create `src/app/api/newmodule/exercises/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Fetch from database or external API
    const exercises = [
      // ... exercise data
    ]

    return NextResponse.json(exercises)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Save to database
    // const result = await db.exercises.create(data)

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create exercise' },
      { status: 500 }
    )
  }
}
```

## Testing

### Unit Testing with Jest

Create `src/components/Button.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/components/Button'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('handles click events', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalled()
  })

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })
})
```

### E2E Testing with Playwright

Create `e2e/dashboard.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard')
  })

  test('displays user progress', async ({ page }) => {
    const progressCard = page.locator('[data-testid="progress-card"]')
    expect(progressCard).toBeVisible()
  })

  test('navigates to speaking module', async ({ page }) => {
    await page.click('text=Speaking')
    expect(page).toHaveURL('/speaking')
  })
})
```

## Performance Optimization

### Code Splitting

```typescript
// Instead of:
import HeavyComponent from '@/components/HeavyComponent'

// Use:
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>,
})
```

### Image Optimization

```typescript
import Image from 'next/image'

// Use Next.js Image for automatic optimization
<Image
  src="/avatar.png"
  alt="Avatar"
  width={100}
  height={100}
  priority
/>
```

### Lazy Loading

```typescript
<div data-testid="lazy-section">
  {isVisible && <ExpensiveComponent />}
</div>
```

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Deploy to production
vercel --prod
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t englishcanvas .
docker run -p 3000:3000 englishcanvas
```

## Debugging

### Enable Source Maps

In `next.config.js`:

```javascript
module.exports = {
  productionBrowserSourceMaps: true,
}
```

### Use React DevTools

```bash
npm install @react-devtools/shell
```

### Console Logging in Development

```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

## Best Practices

1. **Type Safety**: Always use TypeScript for new files
2. **Component Structure**: Keep components small and focused
3. **Error Handling**: Always handle errors gracefully
4. **Documentation**: Add comments for complex logic
5. **Testing**: Write tests for new features
6. **Performance**: Optimize images, lazy load, code split
7. **Security**: Never hardcode secrets, validate input
8. **Accessibility**: Use semantic HTML, ARIA labels

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Cache Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues

1. Check `.env.local` configuration
2. Verify API endpoints are accessible
3. Check CORS settings
4. Review browser console for errors

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.vercel.app/)

## Getting Help

- Check existing issues on GitHub
- Create a new issue with detailed description
- Join our Discord community
- Email: dev@englishcanvas.com
