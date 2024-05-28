export interface Flashcard {
  id: string
  word: string
  definition: string
  exampleSentence?: string
  deckId: string
  createdAt: Date
  reviewCount: number
  lastReviewedAt: Date | null
  nextReviewAt: Date
  easeFactor: number
  interval: number
}
