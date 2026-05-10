# EnglishCanvas 🎓

A modern, AI-powered English learning platform that makes language acquisition engaging, interactive, and effective.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-In%20Development-yellow)

## 🌟 Features

### 📊 Dashboard
- Real-time progress tracking
- Streak counter and achievement badges
- Weekly goal management
- Personalized learning recommendations

### 🎤 Speaking Module
- Real-time speech recognition and analysis
- Pronunciation feedback
- Fluency assessment
- Shadowing and repetition exercises
- AI-powered conversation practice

### 👂 Listening Module
- Authentic audio materials
- Adjustable playback speed
- Synchronized transcripts
- Comprehension quizzes
- Podcast integration

### 📖 Reading Module
- Leveled reading materials
- Interactive vocabulary support
- Text-to-speech functionality
- Comprehension questions
- Adjustable font sizes

### ✍️ Writing Module
- Real-time grammar checking
- AI-powered style suggestions
- Vocabulary recommendations
- Writing statistics and insights
- Detailed correction feedback

### 📚 Vocabulary Builder
- Smart flashcard system with spaced repetition
- Contextual examples and usage
- Audio pronunciation
- Category-based organization
- Progress tracking

### 🤖 AI Tutor
- 24/7 conversational practice
- Grammar instruction
- Interview preparation
- Adaptive difficulty
- Personalized feedback

### 🎨 Gamification
- Achievement system
- Points and levels
- Daily challenges
- Streak tracking
- Leaderboards

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/englishcanvas.git
cd englishcanvas

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/              # Next.js pages and layouts
├── components/       # Reusable React components
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
├── lib/             # Utility functions and services
└── styles/          # Global CSS and Tailwind config
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed structure documentation.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Google Cloud APIs
GOOGLE_CLOUD_SPEECH_API_KEY=your_speech_api_key
GOOGLE_CLOUD_TTS_API_KEY=your_tts_api_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/englishcanvas

# Authentication
JWT_SECRET=your_jwt_secret
NEXTAUTH_URL=http://localhost:3000

# Optional: Stripe for payments
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 💻 Development

### Build Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 📱 Module Details

### Speaking Module
- **Audio Input**: Uses Web Audio API for recording
- **Speech Recognition**: Google Cloud Speech-to-Text
- **Analysis**: Gemini API for feedback generation
- **Metrics**: Accuracy, pronunciation, fluency scores

### Writing Module
- **Grammar Checking**: Languagetool API integration
- **AI Suggestions**: Gemini API for improvements
- **Analytics**: Word count, readability metrics
- **Storage**: User submissions stored with versioning

### Reading Module
- **Content**: Categorized by difficulty level
- **Vocabulary**: Inline definitions with audio
- **Comprehension**: Interactive quiz questions
- **Tracking**: Reading time and accuracy metrics

### Flashcard System
- **Algorithm**: SM-2 Spaced Repetition
- **Storage**: User flashcard data with sync
- **Categories**: Organized by topic
- **Progress**: Ease factor and retention rates

### AI Tutor
- **Modes**: Conversation, grammar, interview
- **Context**: Maintains conversation history
- **Feedback**: Real-time corrections
- **Adaptation**: Adjusts to user level

## 🔐 Security

- JWT-based authentication
- HTTPS/TLS encryption
- SQL injection prevention
- XSS protection with Content Security Policy
- Rate limiting on API endpoints
- GDPR-compliant data handling

## 📊 Database

### PostgreSQL Schema
The application uses PostgreSQL with the following main collections:

- **users** - User accounts and profiles
- **learning_progress** - User learning statistics
- **speaking_exercises** - Speaking practice content
- **speaking_results** - User speaking exercise results
- **writing_exercises** - Writing assignments
- **writing_submissions** - User essay submissions
- **flashcards** - Vocabulary flashcards
- **flashcard_sessions** - Flashcard study sessions
- **reading_materials** - Reading content
- **ai_tutor_sessions** - AI tutor conversation history

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed schema information.

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core learning modules
- ✅ Dashboard and progress tracking
- ✅ Flashcard system
- ✅ AI tutor basic functionality

### Phase 2
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] Certification program

### Phase 3
- [ ] Community features
- [ ] Content partnerships
- [ ] Advanced gamification
- [ ] Integration with platforms (Slack, Teams)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

We use:
- **ESLint** for linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run the formatter before committing:

```bash
npm run format
```

## 🐛 Bug Reporting

Found a bug? Please create an issue with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Google Cloud APIs for speech and language processing
- OpenAI Gemini API for intelligent tutoring
- The open-source community for amazing tools and libraries

## 📞 Support

For support, email support@englishcanvas.com or visit our website at www.englishcanvas.com

---

Made with ❤️ by the EnglishCanvas Team
