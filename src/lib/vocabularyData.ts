export interface VocabWord {
  id: string
  word: string
  pronunciation: string
  meaning: string
  example: string
  category: string
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  partOfSpeech: string
}

export interface VocabCategory {
  id: string
  name: string
  emoji: string
  color: string
}

export const categories: VocabCategory[] = [
  { id: 'daily', name: 'Daily Life', emoji: '🏠', color: 'primary' },
  { id: 'business', name: 'Business', emoji: '💼', color: 'secondary' },
  { id: 'nature', name: 'Nature', emoji: '🌳', color: 'green' },
  { id: 'emotions', name: 'Emotions', emoji: '😊', color: 'rose' },
  { id: 'tech', name: 'Technology', emoji: '💻', color: 'blue' },
  { id: 'culture', name: 'Culture', emoji: '🎭', color: 'purple' },
]

export const wordDatabase: VocabWord[] = [
  // Daily Life
  { id: 'd1', word: 'breakfast', pronunciation: '/ˈbrekfəst/', meaning: 'The first meal of the day', example: 'I have breakfast at 7 AM every morning.', category: 'daily', difficulty: 'A1', partOfSpeech: 'noun' },
  { id: 'd2', word: 'commute', pronunciation: '/kəˈmjuːt/', meaning: 'To travel regularly between home and work', example: 'I commute by train every day.', category: 'daily', difficulty: 'B1', partOfSpeech: 'verb' },
  { id: 'd3', word: 'errand', pronunciation: '/ˈerənd/', meaning: 'A short trip to accomplish a small task', example: 'I need to run some errands this afternoon.', category: 'daily', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 'd4', word: 'laundry', pronunciation: '/ˈlɔːndri/', meaning: 'Clothes and linens that need to be washed', example: 'I do laundry every Saturday.', category: 'daily', difficulty: 'A2', partOfSpeech: 'noun' },
  { id: 'd5', word: 'leisure', pronunciation: '/ˈliːʒər/', meaning: 'Free time for relaxation and enjoyment', example: 'Reading is my favorite leisure activity.', category: 'daily', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 'd6', word: 'chore', pronunciation: '/tʃɔːr/', meaning: 'A routine household task', example: 'Washing dishes is my least favorite chore.', category: 'daily', difficulty: 'B1', partOfSpeech: 'noun' },
  { id: 'd7', word: 'tidy', pronunciation: '/ˈtaɪdi/', meaning: 'Neat and organized', example: 'Please keep your room tidy.', category: 'daily', difficulty: 'A2', partOfSpeech: 'adjective' },
  { id: 'd8', word: 'snooze', pronunciation: '/snuːz/', meaning: 'To sleep lightly for a short time', example: 'I always hit the snooze button twice.', category: 'daily', difficulty: 'B1', partOfSpeech: 'verb' },

  // Business
  { id: 'b1', word: 'deadline', pronunciation: '/ˈdedlaɪn/', meaning: 'The latest time by which something must be completed', example: 'The deadline for the project is Friday.', category: 'business', difficulty: 'B1', partOfSpeech: 'noun' },
  { id: 'b2', word: 'negotiate', pronunciation: '/nɪˈɡoʊʃieɪt/', meaning: 'To discuss in order to reach an agreement', example: 'We negotiated the contract terms for hours.', category: 'business', difficulty: 'B2', partOfSpeech: 'verb' },
  { id: 'b3', word: 'revenue', pronunciation: '/ˈrevənjuː/', meaning: 'Income generated from business activities', example: 'Our revenue grew 20% last quarter.', category: 'business', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 'b4', word: 'stakeholder', pronunciation: '/ˈsteɪkhoʊldər/', meaning: 'Someone with an interest in an organization', example: 'We need to inform all stakeholders.', category: 'business', difficulty: 'C1', partOfSpeech: 'noun' },
  { id: 'b5', word: 'scalable', pronunciation: '/ˈskeɪləbl/', meaning: 'Able to grow or be expanded easily', example: 'We need a scalable solution.', category: 'business', difficulty: 'C1', partOfSpeech: 'adjective' },
  { id: 'b6', word: 'leverage', pronunciation: '/ˈlevərɪdʒ/', meaning: 'To use something to maximum advantage', example: 'We can leverage our existing customer base.', category: 'business', difficulty: 'C1', partOfSpeech: 'verb' },
  { id: 'b7', word: 'pitch', pronunciation: '/pɪtʃ/', meaning: 'A persuasive presentation to sell an idea', example: 'My pitch went well with investors.', category: 'business', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 'b8', word: 'turnover', pronunciation: '/ˈtɜːrnoʊvər/', meaning: 'Total revenue or rate of employees leaving', example: 'Our annual turnover is one million dollars.', category: 'business', difficulty: 'C1', partOfSpeech: 'noun' },

  // Nature
  { id: 'n1', word: 'breeze', pronunciation: '/briːz/', meaning: 'A gentle wind', example: 'A cool breeze blew through the trees.', category: 'nature', difficulty: 'A2', partOfSpeech: 'noun' },
  { id: 'n2', word: 'meadow', pronunciation: '/ˈmedoʊ/', meaning: 'A field of grass and flowers', example: 'The cows grazed in the meadow.', category: 'nature', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 'n3', word: 'wilderness', pronunciation: '/ˈwɪldərnəs/', meaning: 'Wild, uncultivated land', example: 'They hiked through the wilderness.', category: 'nature', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 'n4', word: 'ecosystem', pronunciation: '/ˈiːkoʊsɪstəm/', meaning: 'A community of living organisms and environment', example: 'Coral reefs are delicate ecosystems.', category: 'nature', difficulty: 'C1', partOfSpeech: 'noun' },
  { id: 'n5', word: 'drought', pronunciation: '/draʊt/', meaning: 'A long period without rain', example: 'The drought destroyed many crops.', category: 'nature', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 'n6', word: 'pristine', pronunciation: '/ˈprɪstiːn/', meaning: 'In its original condition; unspoiled', example: 'The beach was pristine and beautiful.', category: 'nature', difficulty: 'C1', partOfSpeech: 'adjective' },
  { id: 'n7', word: 'foliage', pronunciation: '/ˈfoʊliɪdʒ/', meaning: 'Plant leaves collectively', example: 'The autumn foliage was stunning.', category: 'nature', difficulty: 'C1', partOfSpeech: 'noun' },
  { id: 'n8', word: 'habitat', pronunciation: '/ˈhæbɪtæt/', meaning: 'The natural home of an animal or plant', example: 'Pandas are losing their natural habitat.', category: 'nature', difficulty: 'B1', partOfSpeech: 'noun' },

  // Emotions
  { id: 'e1', word: 'nostalgia', pronunciation: '/nɑːˈstældʒə/', meaning: 'Sentimental longing for the past', example: 'Hearing that song filled me with nostalgia.', category: 'emotions', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 'e2', word: 'serenity', pronunciation: '/səˈrenəti/', meaning: 'A state of peaceful calmness', example: 'I found serenity at the lake.', category: 'emotions', difficulty: 'C1', partOfSpeech: 'noun' },
  { id: 'e3', word: 'overwhelmed', pronunciation: '/ˌoʊvərˈwelmd/', meaning: 'Feeling buried under too much', example: 'I felt overwhelmed by the workload.', category: 'emotions', difficulty: 'B2', partOfSpeech: 'adjective' },
  { id: 'e4', word: 'apprehensive', pronunciation: '/ˌæprɪˈhensɪv/', meaning: 'Anxious about the future', example: 'I was apprehensive before the interview.', category: 'emotions', difficulty: 'C1', partOfSpeech: 'adjective' },
  { id: 'e5', word: 'elated', pronunciation: '/ɪˈleɪtɪd/', meaning: 'Extremely happy and excited', example: 'She was elated to receive the award.', category: 'emotions', difficulty: 'C1', partOfSpeech: 'adjective' },
  { id: 'e6', word: 'resentment', pronunciation: '/rɪˈzentmənt/', meaning: 'Bitter indignation', example: 'He held resentment toward his former boss.', category: 'emotions', difficulty: 'C1', partOfSpeech: 'noun' },
  { id: 'e7', word: 'empathy', pronunciation: '/ˈempəθi/', meaning: 'Understanding others\' feelings', example: 'Good leaders show empathy.', category: 'emotions', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 'e8', word: 'melancholy', pronunciation: '/ˈmelənkɑːli/', meaning: 'A deep, pensive sadness', example: 'A sense of melancholy filled the room.', category: 'emotions', difficulty: 'C1', partOfSpeech: 'noun' },

  // Technology
  { id: 't1', word: 'algorithm', pronunciation: '/ˈælɡərɪðəm/', meaning: 'A step-by-step procedure to solve a problem', example: 'The algorithm sorts data efficiently.', category: 'tech', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 't2', word: 'encryption', pronunciation: '/ɪnˈkrɪpʃn/', meaning: 'Converting data into a coded form', example: 'End-to-end encryption protects your messages.', category: 'tech', difficulty: 'C1', partOfSpeech: 'noun' },
  { id: 't3', word: 'bandwidth', pronunciation: '/ˈbændwɪdθ/', meaning: 'Data transmission capacity', example: 'Video streaming requires high bandwidth.', category: 'tech', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 't4', word: 'cache', pronunciation: '/kæʃ/', meaning: 'Temporary storage for quick access', example: 'Clear your browser cache to fix the issue.', category: 'tech', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 't5', word: 'iterate', pronunciation: '/ˈɪtəreɪt/', meaning: 'To repeat a process to improve', example: 'We iterate on the design weekly.', category: 'tech', difficulty: 'C1', partOfSpeech: 'verb' },
  { id: 't6', word: 'deploy', pronunciation: '/dɪˈplɔɪ/', meaning: 'To make software available for use', example: 'We deploy updates every Monday.', category: 'tech', difficulty: 'B2', partOfSpeech: 'verb' },
  { id: 't7', word: 'glitch', pronunciation: '/ɡlɪtʃ/', meaning: 'A minor malfunction', example: 'There\'s a glitch in the system.', category: 'tech', difficulty: 'B1', partOfSpeech: 'noun' },
  { id: 't8', word: 'mainframe', pronunciation: '/ˈmeɪnfreɪm/', meaning: 'A large, powerful computer', example: 'Banks still use mainframes.', category: 'tech', difficulty: 'C1', partOfSpeech: 'noun' },

  // Culture
  { id: 'c1', word: 'heritage', pronunciation: '/ˈherɪtɪdʒ/', meaning: 'Tradition passed down through generations', example: 'We must preserve our cultural heritage.', category: 'culture', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 'c2', word: 'etiquette', pronunciation: '/ˈetɪket/', meaning: 'Rules of polite behavior', example: 'Business etiquette varies by country.', category: 'culture', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 'c3', word: 'folklore', pronunciation: '/ˈfoʊklɔːr/', meaning: 'Traditional beliefs and stories', example: 'Brazilian folklore is rich and colorful.', category: 'culture', difficulty: 'C1', partOfSpeech: 'noun' },
  { id: 'c4', word: 'serendipity', pronunciation: '/ˌserənˈdɪpəti/', meaning: 'Finding something valuable by chance', example: 'It was pure serendipity that we met.', category: 'culture', difficulty: 'C1', partOfSpeech: 'noun' },
  { id: 'c5', word: 'eloquent', pronunciation: '/ˈeləkwənt/', meaning: 'Fluent and expressive in speaking', example: 'Her eloquent speech inspired everyone.', category: 'culture', difficulty: 'C1', partOfSpeech: 'adjective' },
  { id: 'c6', word: 'ephemeral', pronunciation: '/ɪˈfemərəl/', meaning: 'Lasting for a very short time', example: 'The beauty of cherry blossoms is ephemeral.', category: 'culture', difficulty: 'C1', partOfSpeech: 'adjective' },
  { id: 'c7', word: 'taboo', pronunciation: '/təˈbuː/', meaning: 'A social prohibition', example: 'Talking about money is taboo here.', category: 'culture', difficulty: 'B2', partOfSpeech: 'noun' },
  { id: 'c8', word: 'cuisine', pronunciation: '/kwɪˈziːn/', meaning: 'A style of cooking', example: 'Italian cuisine is famous worldwide.', category: 'culture', difficulty: 'B1', partOfSpeech: 'noun' },
]
