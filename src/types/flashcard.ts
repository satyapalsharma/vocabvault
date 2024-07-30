/**
 * Denormalized representation of a flashcard for display and review.
 *
 * Combines data from Word, Deck, and Card into a single shape optimized for the UI.
 */
export interface Flashcard {
  /** Unique identifier for the flashcard. */
  id: string
  /** The word or phrase being reviewed. */
  word: string
  /** The definition shown after flipping the card. */
  definition: string
  /** Optional example sentence shown after flipping the card. */
  exampleSentence?: string
  /** Reference to the parent deck. */
  deckId: string
  /** Timestamp when the flashcard was first created. */
  createdAt: Date
  /** Total number of times this card has been reviewed. */
  reviewCount: number
  /** Timestamp of the most recent review, or null if never reviewed. */
  lastReviewedAt: Date | null
  /** Date and time when the card is next due for review. */
  nextReviewAt: Date
  /** Current ease factor used for interval calculation. */
  easeFactor: number
  /** Current interval in days until the next review. */
  interval: number
}
