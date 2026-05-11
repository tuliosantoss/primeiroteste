# EnglishCanvas - Wireframes & User Flow

## User Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Landing Page → Sign Up/Login → Dashboard → Learning Modules   │
│                                     ↓                           │
│                    Profile & Settings ← ─ ─ ─ ┘                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Learning Module Flow:
    Exercise Selection → Content/Activity → Submit/Record 
                            ↓
                        Analysis & Feedback
                            ↓
                    Results & Suggestions
```

## Screen Wireframes

### 1. Landing Page (Home)

```
┌────────────────────────────────────────────┐
│ Logo    [Features] [Pricing] [Sign In]     │
├────────────────────────────────────────────┤
│                                            │
│   Master English with AI-Powered Learning │
│                                            │
│   [Start Free Trial] [Watch Demo]          │
│                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 50K+     │  │ 4.9★     │  │ 89%      │ │
│  │ Learners │  │ Rating   │  │ Success  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│  🎤 Speaking    👂 Listening   📖 Reading │
│  ✍️  Writing     📚 Vocabulary   🤖 Tutor  │
│                                            │
├────────────────────────────────────────────┤
│  Features | Company | Legal | Connect    │
│                                            │
└────────────────────────────────────────────┘
```

### 2. Dashboard

```
┌──────────────────────────────────────────────────────────┐
│ ☰  Dashboard  [Settings] [Dark/Light] [User] [Logout]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Welcome back, John! 👋                                 │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 🔥 7     │  │ ⭐ 8.5K  │  │ 🏆 12    │  │ ⏰ 20h   │ │
│  │ Streak   │  │ XP       │  │ Awards   │  │ This Mo. │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Level: B1         Weekly Goal: 245/300 min  ████░ │ │
│  │                                                    │ │
│  │  Total: 1245 min | Streak: 7 | Best: 23        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Learning Modules                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │ │
│  │ 🎤 65%   │ │ 👂 45%   │ │ 📖 78%   │              │ │
│  │ Speaking │ │ Listening│ │ Reading  │              │ │
│  └──────────┘ └──────────┘ └──────────┘              │ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │ │
│  │ ✍️  52%   │ │ 📚 88%   │ │ 🎨 35%   │              │ │
│  │ Writing  │ │ Vocab    │ │ Cards    │              │ │
│  └──────────┘ └──────────┘ └──────────┘              │ │
│                                                          │
│  Recent Achievements                                    │
│  ┌──────────────────┐  ┌──────────────────┐          │ │
│  │ 🔥 7-Day Streak  │  │ 🎤 Speaking Master│          │ │
│  └──────────────────┘  └──────────────────┘          │ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Today's Challenge: Speaking Exercise (+50 XP)     │ │
│  │ [Start Challenge] [Skip]                           │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 3. Speaking Module

```
┌──────────────────────────────────────────────────────────┐
│ ☰  Speaking Practice  [← Prev] [Next →]                 │
├──────────────────────────────────────────────────────────┤
│ Exercise 1 of 3                                          │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │                                                      │ │
│ │  Phone Conversation                                 │ │
│ │  Practice making a phone call in English        │ │
│ │                                                      │ │
│ │  ┌────────────────────────────────────────────────┐ │ │
│ │  │ 📝 Instructions                                │ │ │
│ │  │ Listen to the phrase, then record your voice   │ │ │
│ │  │ Try to match pronunciation and intonation      │ │ │
│ │  └────────────────────────────────────────────────┘ │ │
│ │                                                      │ │
│ │  ┌────────────────────────────────────────────────┐ │ │
│ │  │ 🎯 Target Phrase                              │ │ │
│ │  │ "Hello, I'd like to schedule an appointment"  │ │ │
│ │  │ [🔊 Listen]                                    │ │ │
│ │  └────────────────────────────────────────────────┘ │ │
│ │                                                      │ │
│ │  [🎤 Start Recording] or [⏹️ Stop Recording]      │ │ │
│ │                                                      │ │
│ │  Recording State:                                  │ │ │
│ │  🎵 [Play] [Re-record] [Submit for Analysis]   │ │ │
│ │                                                      │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 📊 Analysis Results                                  │ │
│ │                                                      │ │
│ │ Overall Score: 82%                                  │ │
│ │                                                      │ │
│ │ Accuracy:      ████████░  85%                       │ │
│ │ Pronunciation: ███████░░  78%                       │ │
│ │ Fluency:       ████████░  82%                       │ │
│ │                                                      │ │
│ │ ✓ Good pronunciation of "appointment"               │ │
│ │ ⚠ Try to slow down slightly for clarity            │ │
│ │ ✓ Excellent intonation at the end                  │ │
│ │                                                      │ │
│ │ Transcription: "Hello I would like to schedule"    │ │
│ │                                                      │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4. Writing Module

```
┌──────────────────────────────────────────────────────────┐
│ ☰  Writing Practice  [← Prev] [Next →]                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Personal Introduction                               │ │
│ │ About Yourself                                      │ │
│ │                                                      │ │
│ │ Write about yourself, including: name, origins,    │ │
│ │ interests, and goals for learning English          │ │
│ │                                                      │ │
│ │ Word Count: 0 / 80-150 min          Beginner     │ │
│ │                                                      │ │
│ │ ┌──────────────────────────────────────────────────┐ │ │
│ │ │ [Start typing your essay here...]                │ │ │
│ │ │                                                  │ │ │
│ │ │                                                  │ │ │
│ │ │                                                  │ │ │
│ │ │                                                  │ │ │
│ │ └──────────────────────────────────────────────────┘ │ │
│ │                                                      │ │ │
│ │ [Check Grammar ✨] [Submit Essay 📤]               │ │ │
│ │                                                      │ │
│ │ ┌────────────────────────────────────────────────┐ │ │
│ │ │ ⚠️ Grammar Corrections                         │ │ │
│ │ │                                                │ │ │
│ │ │ "I goes" → "I go"                              │ │ │
│ │ │ Subject-verb agreement explanation            │ │ │
│ │ └────────────────────────────────────────────────┘ │ │
│ │                                                      │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 💡 Tips for Better Writing                         │  │
│ │ • Use varied sentence structures                   │  │
│ │ • Check grammar before submitting                  │  │
│ │ • Use transition words                             │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 5. Reading Module

```
┌────────────────────────────────────────────┐
│ ☰  Reading Practice [A-] [A] [A+]          │
├────────────────────────────────────────────┤
│                                            │
│ The Power of Positive Thinking             │
│ 178 words • ~3 min read                   │
│                                            │
│ Positive thinking is a mental and          │
│ emotional attitude that focuses on the     │
│ bright side of life. People who practice   │
│ [resilience] tend to be more motivated...  │
│                                            │
│                                            │
│ ├─────────────────────────────────────────┤ │
│ │ Comprehension Questions                 │ │
│ │                                         │ │
│ │ Q: What is the main benefit?            │ │
│ │ ○ It guarantees success                │ │
│ │ ○ It can improve mental health          │ │
│ │ ○ It eliminates problems                │ │
│ │ ○ It makes people rich                  │ │
│ └─────────────────────────────────────────┘ │
│                                            │
└────┐                              ┌────────┘
     │                              │
     │                    ┌─────────▼────┐
     │                    │ Vocabulary   │
     │                    │ Panel        │
     │                    │ ┌──────────┐ │
     │                    │ │resilience│ │
     │                    │ │/ˌrɪz.ɪ.ː│ │
     │                    │ │Ability to│ │
     │                    │ │recover   │ │
     │                    │ │[🔊 Hear] │ │
     │                    │ │[💾 Save] │ │
     │                    │ └──────────┘ │
     │                    └──────────────┘
```

### 6. Flashcards

```
┌──────────────────────────────────────────────────────────┐
│ ☰  Flashcards                            [Exit]          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Select Category                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ All      │ │ Business │ │ Casual   │               │
│  │ 285      │ │ 45       │ │ 52       │               │
│  └──────────┘ └──────────┘ └──────────┘               │
│                                                          │
│  Card 1 of 4                                           │
│  Progress: ████████░░ 25%                              │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │                                                    │ │
│  │              Click to Reveal                      │ │
│  │                                                    │ │
│  │           To procrastinate                        │ │
│  │                                                    │ │
│  │            [🔊 Pronounce]                         │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [← Previous] [Next →]                                  │
│                                                          │
│  After Flip:                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │                                                    │ │
│  │     To delay or postpone something                │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [❌ Hard] [✓ Got it!]                                  │
│                                                          │
│  Session Stats:                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ 1 Correct│  │ 0 Hard   │  │ 75%      │            │
│  │ Cards    │  │ Cards    │  │ Accuracy │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 7. AI Tutor

```
┌──────────────────────────────────────────────────────────┐
│ ☰  AI Tutor Mode Selection                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Choose Learning Mode:                                  │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 💬 Free Conversation                                │ │
│  │ Have a natural conversation on any topic           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📚 Grammar Tutor                                    │ │
│  │ Learn and practice English grammar                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 💼 Interview Practice                              │ │
│  │ Practice for job interviews                        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ✓ Correct Your Mistakes                             │ │
│  │ ✓ Adapt to Your Level                              │ │
│  │ ✓ Natural Conversations                             │ │
│  │ ✓ Practice Real Scenarios                           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘

During Chat:

┌──────────────────────────────────────────────────────────┐
│ ☰  Free Conversation  [Change Mode]                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Hello! I'm your AI English tutor...                │ │
│  │                                                    │ │
│  │                        You: That sounds great!    │ │
│  │                                                    │ │
│  │ Great! Let's get started. What's your name?      │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Your message...] [Send]                            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                          │
│  💡 Ask for corrections, request grammar help...      │ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Responsive Design Breakpoints

```
Mobile (< 768px)
├─ Single column layout
├─ Stacked cards
└─ Touch-friendly buttons

Tablet (768px - 1024px)
├─ Two column layout
├─ Sidebar collapses to icons
└─ Optimized spacing

Desktop (> 1024px)
├─ Three column layout
├─ Full sidebar
└─ Enhanced interactions
```

## Color Palette

```
Primary:    #0ea5e9 (Sky Blue) - Main actions, highlights
Secondary:  #a855f7 (Purple)  - Secondary actions, accents
Success:    #22c55e (Green)   - Positive feedback, completion
Warning:    #f59e0b (Amber)   - Caution, intermediate level
Danger:     #ef4444 (Red)     - Errors, important warnings
Dark:       #111827 (Dark)    - Text, backgrounds
Light:      #f9fafb (Light)   - Backgrounds, cards
```

## Typography Hierarchy

```
H1 (36-42px) - Page titles
H2 (28-32px) - Section headers
H3 (20-24px) - Subsection headers
H4 (16-18px) - Component headers
Body (14-16px) - Main text
Small (12-14px) - Secondary text, captions
```

## Interactive Components

### Button States

```
Default    [Primary Button]
Hover      [Primary Button]  (darker background)
Active     [Primary Button]  (scale down)
Disabled   [Primary Button]  (opacity 50%)
Loading    [Primary Button]  (spinner icon)
```

### Card Hover Effects

```
Default    ┌──────────────┐
           │   Card       │
           │ Content      │
           └──────────────┘

Hoverable  ┌──────────────┐
           │   Card       │ (shadow increases, scale up)
           │ Content      │
           └──────────────┘
```

## Animation Specifications

```
Fade In:       0.3s ease-in-out
Slide Up:      0.3s ease-out (from 10px below)
Pulse:         2s infinite (opacity 0.5 → 1)
Scale:         0.95 on click/press
Bounce:        0.2s cubic-bezier ease
```

## Accessibility Features

```
✓ ARIA labels for all interactive elements
✓ Keyboard navigation support (Tab, Enter, Escape)
✓ Focus visible states (outline ring)
✓ Semantic HTML (button, nav, main, etc.)
✓ Alt text for all images
✓ Color contrast ratio ≥ 4.5:1
✓ Screen reader friendly
✓ Reduced motion support
```
