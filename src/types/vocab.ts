export interface Word {
  id: string
  term: string
  definition: string
  example?: string
  pronunciation?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Deck {
  id: string
  name: string
  description?: string
  cardIds: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Card {
  id: string
  wordId: string
  deckId: string
  interval: number
  easeFactor: number
  repetitions: number
  dueDate: Date
  lastReviewDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateWordInput {
  term: string
  definition: string
  example?: string
  pronunciation?: string
  tags?: string[]
}

export interface CreateDeckInput {
  name: string
  description?: string
}

export interface AddCardToDeckInput {
  wordId: string
  deckId: string
}
