import { ReadingMaterial, VocabularyItem } from '@/types'

export function parseCSV(csvText: string): Array<{
  title: string
  content: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}> {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []

  const result = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    // Simple CSV parser: handle quoted fields
    const fields = []
    let current = ''
    let inQuotes = false
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim().replace(/^"|"$/g, ''))
        current = ''
      } else {
        current += char
      }
    }
    fields.push(current.trim().replace(/^"|"$/g, ''))

    if (fields.length >= 3) {
      const [title, content, difficulty] = fields
      if (
        title &&
        content &&
        ['beginner', 'intermediate', 'advanced'].includes(difficulty.toLowerCase())
      ) {
        result.push({
          title: title.trim(),
          content: content.trim(),
          difficulty: difficulty.toLowerCase() as 'beginner' | 'intermediate' | 'advanced',
        })
      }
    }
  }

  return result
}

export async function searchWikipedia(query: string): Promise<
  Array<{
    title: string
    extract: string
  }>
> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=5&origin=*`
    )
    const data = await response.json()
    return data.query?.search || []
  } catch (error) {
    console.error('Wikipedia search error:', error)
    return []
  }
}

export async function fetchWikipediaArticle(
  title: string
): Promise<{ title: string; content: string } | null> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&explaintext=true&format=json&origin=*`
    )
    const data = await response.json()
    const pages = data.query?.pages
    if (!pages) return null

    const page = Object.values(pages)[0] as { title?: string; extract?: string }
    if (page?.extract) {
      // Clean up the extract - remove references and limit length
      const content = page.extract
        .replace(/\[\d+\]/g, '')
        .split('\n\n')
        .slice(0, 5)
        .join('\n\n')
        .substring(0, 2000)

      return {
        title: page.title || title,
        content,
      }
    }
  } catch (error) {
    console.error('Wikipedia fetch error:', error)
  }
  return null
}

export function extractVocabularyFromText(content: string, count = 5): VocabularyItem[] {
  const words = content.toLowerCase().split(/\s+/)
  const wordFreq: Record<string, number> = {}

  // Count word frequencies (exclude common words)
  const commonWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'can',
    'of',
    'in',
    'on',
    'at',
    'to',
    'for',
    'from',
    'with',
    'by',
    'as',
    'it',
    'this',
    'that',
    'these',
    'those',
    'i',
    'you',
    'he',
    'she',
    'we',
    'they',
    'what',
    'which',
    'who',
    'when',
    'where',
    'why',
    'how',
  ])

  for (const word of words) {
    const clean = word.replace(/[^a-z]/g, '')
    if (clean.length > 5 && !commonWords.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1
    }
  }

  // Get top words
  const topWords = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([word]) => word)

  // Create vocabulary items (with placeholder definitions)
  return topWords.map((word, idx) => ({
    id: `vocab-${idx}`,
    word,
    pronunciation: '',
    definition: `Important word in this text: "${word}"`,
    example: '',
    partOfSpeech: 'noun',
    difficulty: 'B1',
    synonyms: [],
    category: 'extracted',
  }))
}

export function generateComprehensionQuestions(
  content: string,
  title: string
): Array<{
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}> {
  const sentences = content
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)

  if (sentences.length < 3) return []

  const questions = []

  // Question 1: Main topic
  questions.push({
    id: 'q1',
    question: `What is the main topic of "${title}"?`,
    options: [
      title,
      'Something unrelated',
      'Another topic',
      'Historical events',
    ].sort(() => Math.random() - 0.5),
    correctAnswer: title,
    explanation: `The text is about ${title}.`,
  })

  // Question 2: Key detail from middle sentence
  if (sentences.length > 2) {
    const keyIdx = Math.floor(sentences.length / 2)
    const keySentence = sentences[keyIdx]
    const words = keySentence.split(/\s+/)
    const keyWord = words.find((w) => w.length > 4) || 'information'

    questions.push({
      id: 'q2',
      question: `According to the text, which is true?`,
      options: [
        `The text mentions "${keyWord}"`,
        'No relevant information provided',
        'The opposite is stated',
        'This is not discussed',
      ],
      correctAnswer: `The text mentions "${keyWord}"`,
      explanation: `The passage contains information about ${keyWord}.`,
    })
  }

  // Question 3: Understanding
  questions.push({
    id: 'q3',
    question: `What can be inferred from this text?`,
    options: [
      'The author has knowledge about the topic',
      'This is purely fictional',
      'No conclusions can be drawn',
      'The topic is irrelevant',
    ],
    correctAnswer: 'The author has knowledge about the topic',
    explanation:
      'The detailed nature of the text suggests the author has information about the subject.',
  })

  return questions
}
