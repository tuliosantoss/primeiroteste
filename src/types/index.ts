// User Types
export type UserRole = 'student' | 'teacher' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  password?: string
  avatar?: string
  role: UserRole
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  joinedAt: Date
  darkMode: boolean
  phone?: string
  bio?: string
  country?: string
  nativeLanguage?: string
}

export interface StudentProfile extends User {
  role: 'student'
  totalMinutesStudied: number
  currentStreak: number
  xp: number
}

export interface TeacherProfile extends User {
  role: 'teacher'
  studentsCount: number
  coursesCreated: number
  totalStudentsLearned: number
}

export interface AdminProfile extends User {
  role: 'admin'
  permissions: string[]
}

// Learning Progress Types
export interface LearningProgress {
  userId: string
  totalMinutesStudied: number
  currentStreak: number
  longestStreak: number
  lastStudyDate: Date
  weeklyGoal: number
  weeklyProgress: number
  level: string
  xp: number
  achievements: Achievement[]
}

export interface DailyActivity {
  date: Date
  minutesStudied: number
  modules: string[]
  score: number
}

// Speaking Module Types
export interface SpeakingExercise {
  id: string
  title: string
  description: string
  targetPhrase: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  audioUrl?: string
  instructions: string
}

export interface SpeakingResult {
  exerciseId: string
  userAudio: string
  transcription: string
  accuracy: number
  pronunciation: number
  fluency: number
  feedback: string[]
}

// Writing Module Types
export interface WritingExercise {
  id: string
  title: string
  topic: string
  prompt: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  minWords: number
  maxWords: number
}

export interface WritingSubmission {
  exerciseId: string
  userId: string
  content: string
  submittedAt: Date
  corrections: GrammarCorrection[]
  score: number
}

export interface GrammarCorrection {
  original: string
  corrected: string
  type: 'grammar' | 'spelling' | 'vocabulary' | 'style'
  explanation: string
}

// Reading Module Types
export interface ReadingMaterial {
  id: string
  title: string
  content: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  wordCount: number
  estimatedReadingTime: number
  vocabulary: VocabularyItem[]
  comprehensionQuestions: ComprehensionQuestion[]
}

export interface ComprehensionQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

// Listening Module Types
export interface ListeningExercise {
  id: string
  title: string
  description: string
  audioUrl: string
  duration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  transcript: string
  questions: ListeningQuestion[]
  hasSubtitles: boolean
}

export interface ListeningQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  timestamp: number
}

// Vocabulary and Flashcard Types
export interface VocabularyItem {
  id: string
  word: string
  pronunciation: string
  definition: string
  example: string
  partOfSpeech: string
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  imageUrl?: string
  audioUrl?: string
  synonyms: string[]
  category: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  reviewCount: number
  correctCount: number
  lastReviewDate?: Date
  nextReviewDate: Date
  ease: number
}

export interface FlashcardSession {
  id: string
  userId: string
  category: string
  startedAt: Date
  endedAt?: Date
  results: FlashcardResult[]
  accuracy: number
}

export interface FlashcardResult {
  flashcardId: string
  correctness: boolean
  responseTime: number
}

// Achievement Types
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  category: 'milestone' | 'streak' | 'challenge' | 'vocabulary' | 'pronunciation'
}

// Analytics Types
export interface UserAnalytics {
  userId: string
  totalLessonTime: number
  averageDailyTime: number
  moduleProgress: ModuleProgress[]
  weeklyStats: WeeklyStat[]
  skillDistribution: SkillDistribution
}

export interface ModuleProgress {
  moduleName: string
  completed: number
  total: number
  percentage: number
  averageScore: number
}

export interface WeeklyStat {
  week: string
  studyTime: number
  lessonsCompleted: number
  avgScore: number
}

export interface SkillDistribution {
  speaking: number
  listening: number
  reading: number
  writing: number
  vocabulary: number
}

// Export Settings Types
export interface ExportOptions {
  format: 'excel' | 'csv' | 'pdf' | 'json'
  includeAnalytics: boolean
  includeAchievements: boolean
  includeVocabulary: boolean
  dateRange: {
    start: Date
    end: Date
  }
}

// AI Tutor Types
export interface AITutorSession {
  id: string
  userId: string
  mode: 'conversation' | 'interview' | 'grammar' | 'vocabulary'
  startedAt: Date
  endedAt?: Date
  messages: AIMessage[]
  score?: number
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  feedback?: string
}

// Gamification Types
export interface UserStats {
  level: number
  xp: number
  rank: number
  totalAchievements: number
  currentStreak: number
  badges: Badge[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
}
