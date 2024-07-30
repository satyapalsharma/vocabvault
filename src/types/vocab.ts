/**
 * Represents a vocabulary word with rich metadata for flashcard creation.
 */
export interface Word {
  /** Unique identifier for the word. */
  id: string
  /** The word or phrase being learned. */
  term: string
  /** The meaning or translation of the term. */
  definition: string
  /** Optional example sentence demonstrating usage. */
  example?: string
  /** Optional phonetic spelling or pronunciation guide. */
  pronunciation?: string
  /** Categorization labels for filtering and organization. */
  tags: string[]
  /** Timestamp when the word was first created. */
  createdAt: Date
  /** Timestamp when the word was last modified. */
  updatedAt: Date
}

/**
 * Represents a deck that groups flashcards together.
 */
export interface Deck {
  /** Unique identifier for the deck. */
  id: string
  /** Human-readable name of the deck. */
  name: string
  /** Optional longer description of the deck's contents or purpose. */
  description?: string
  /** Ordered list of card IDs contained in this deck. */
  cardIds: string[]
  /** Timestamp when the deck was first created. */
  createdAt: Date
  /** Timestamp when the deck was last modified. */
  updatedAt: Date
}

/**
 * Represents a flashcard linking a word to a deck with spaced repetition state.
 */
export interface Card {
  /** Unique identifier for the card. */
  id: string
  /** Reference to the associated Word. */
  wordId: string
  /** Reference to the parent Deck. */
  deckId: string
  /** Current interval in days until the next review. */
  interval: number
  /** Multiplier used to grow the interval on successful reviews. */
  easeFactor: number
  /** Number of consecutive successful reviews. */
  repetitions: number
  /** Date and time when the card is next due for review. */
  dueDate: Date
  /** Optional date and time of the most recent review. */
  lastReviewDate?: Date
  /** Timestamp when the card was first created. */
  createdAt: Date
  /** Timestamp when the card was last modified. */
  updatedAt: Date
}

/**
 * Input shape for creating a new word.
 */
export interface CreateWordInput {
  /** The word or phrase being learned. */
  term: string
  /** The meaning or translation of the term. */
  definition: string
  /** Optional example sentence demonstrating usage. */
  example?: string
  /** Optional phonetic spelling or pronunciation guide. */
  pronunciation?: string
  /** Optional categorization labels. */
  tags?: string[]
}

/**
 * Input shape for creating a new deck.
 */
export interface CreateDeckInput {
  /** Human-readable name of the deck. */
  name: string
  /** Optional longer description of the deck's contents or purpose. */
  description?: string
}

/**
 * Input shape for adding an existing word to a deck.
 */
export interface AddCardToDeckInput {
  /** Reference to the Word to add. */
  wordId: string
  /** Reference to the target Deck. */
  deckId: string
}
