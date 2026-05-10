# Getting Started - EnglishCanvas

## Quick Start (5 minutes)

### Prerequisites
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm or yarn** - Included with Node.js
- **Git** - [Download](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/englishcanvas.git
cd englishcanvas

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically reload when you make changes.

## Project Setup

### 1. Environment Configuration

Create `.env.local` in the root directory:

```env
# Development
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001

# Google APIs (Get from Google Cloud Console)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLOUD_SPEECH_API_KEY=your_speech_api_key
GOOGLE_CLOUD_TTS_API_KEY=your_tts_api_key

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/englishcanvas

# Authentication
JWT_SECRET=your_super_secret_jwt_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Optional: Stripe for payments
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 2. Database Setup (PostgreSQL)

```bash
# Create database
createdb englishcanvas

# Install Prisma CLI
npm install @prisma/cli --save-dev

# Create Prisma schema (if not exists)
npx prisma init

# Run migrations
npx prisma migrate dev --name init

# Seed sample data (optional)
npx prisma db seed
```

### 3. Get API Keys

#### Google Cloud Setup

1. Create a [Google Cloud Project](https://console.cloud.google.com/)
2. Enable APIs:
   - Google Speech-to-Text API
   - Google Cloud Text-to-Speech API
   - Google Translate API
3. Create an API key and add to `.env.local`

#### Gemini API

1. Get free API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env.local`

## Available Scripts

### Development

```bash
# Start development server (hot reload)
npm run dev

# Run with custom port
npm run dev -- -p 3001
```

### Building & Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Run production build locally
npm start

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Database

```bash
# Open Prisma Studio (GUI for database)
npx prisma studio

# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Project Structure

```
englishcanvas/
├── src/
│   ├── app/                    # Next.js pages
│   ├── components/             # Reusable components
│   ├── store/                  # State management
│   ├── types/                  # TypeScript types
│   ├── lib/                    # Utilities
│   └── styles/                 # Global styles
├── public/                     # Static files
├── tests/                      # Test files
├── .env.example                # Environment variables template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind CSS config
├── next.config.js              # Next.js config
├── README.md                   # Project documentation
├── ARCHITECTURE.md             # Architecture guide
├── DEVELOPMENT.md              # Development guide
└── WIREFRAMES.md               # UI wireframes
```

## Common Tasks

### Adding a New Page

1. Create file in `src/app/yourpage/page.tsx`
2. Use the Layout component for consistency

```typescript
import Layout from '@/components/Layout'

export default function YourPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Your Page</h1>
        {/* Your content */}
      </div>
    </Layout>
  )
}
```

### Creating a Component

1. Create file in `src/components/YourComponent.tsx`
2. Export as default

```typescript
import React from 'react'

interface YourComponentProps {
  title: string
}

const YourComponent: React.FC<YourComponentProps> = ({ title }) => {
  return <div>{title}</div>
}

export default YourComponent
```

### Adding State Management

Use the existing Zustand stores or create new ones in `src/store/`:

```typescript
import { create } from 'zustand'

interface MyState {
  value: string
  setValue: (value: string) => void
}

export const useMyStore = create<MyState>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}))
```

## Debugging

### React DevTools

Install [React DevTools extension](https://react-devtools-tutorial.vercel.app/) for your browser.

### VS Code Debugger

1. Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
2. Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Console Logging

```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Debug:', data)
}
```

## Troubleshooting

### Port Already in Use

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Cache Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found

```bash
# Ensure all imports use absolute paths from tsconfig.json
# Instead of: import Button from '../../../components/Button'
# Use: import Button from '@/components/Button'
```

### Database Connection Issues

1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env.local`
3. Run `npx prisma db push`

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

Set environment variables in Vercel dashboard.

### Deploy to Other Platforms

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy
```

#### Docker

```bash
# Build image
docker build -t englishcanvas .

# Run container
docker run -p 3000:3000 englishcanvas
```

#### AWS/Google Cloud

See respective platform documentation for Next.js deployment.

## Performance Optimization

### Build Analysis

```bash
# Install analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

### Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image'

<Image
  src="/avatar.png"
  alt="Avatar"
  width={100}
  height={100}
  priority
/>
```

### Code Splitting

Use dynamic imports for large components:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>,
})
```

## Testing

### Unit Tests

```bash
# Run tests
npm test

# Run specific test
npm test Button.test.tsx

# Watch mode
npm test -- --watch
```

Example test:

```typescript
import { render, screen } from '@testing-library/react'
import Button from '@/components/Button'

test('renders button', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

### E2E Tests

```bash
# Install Playwright
npm install -D @playwright/test

# Run tests
npx playwright test

# Run in UI mode
npx playwright test --ui
```

## IDE Setup

### VS Code Extensions

Recommended extensions for better development:

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- Thunder Client (API testing)

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "files.exclude": {
    "**/.next": true,
    "**/node_modules": true
  }
}
```

## Learning Resources

### Documentation
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tutorials
- [Next.js Tutorial](https://nextjs.org/learn)
- [React Fundamentals](https://react.dev/learn)
- [TypeScript for React](https://www.typescriptlang.org/docs/handbook/react.html)

### Community
- [Next.js Discussions](https://github.com/vercel/next.js/discussions)
- [React GitHub Issues](https://github.com/facebook/react/issues)
- Stack Overflow with tags: `nextjs`, `react`, `typescript`

## Getting Help

### Before Asking

1. Check the [FAQ](#faq)
2. Search GitHub issues
3. Check existing documentation

### How to Ask

When reporting issues, include:
- OS and Node.js version
- Exact error message
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

### Resources

- **Issues**: [GitHub Issues](https://github.com/yourusername/englishcanvas/issues)
- **Email**: dev@englishcanvas.com
- **Discord**: [Community Server](link)
- **Twitter**: [@EnglishCanvas](link)

## FAQ

**Q: How do I change the port?**
```bash
npm run dev -- -p 3001
```

**Q: How do I use environment variables in components?**
```typescript
// Only use NEXT_PUBLIC_ prefix for client-side vars
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

**Q: How do I deploy without Vercel?**
See deployment section for other options.

**Q: How do I add a database?**
See Database Setup section.

**Q: How do I authenticate users?**
See DEVELOPMENT.md for API integration examples.

---

**Ready to start?** Run `npm run dev` and visit [http://localhost:3000](http://localhost:3000)! 🚀
