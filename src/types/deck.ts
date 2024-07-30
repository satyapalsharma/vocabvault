/**
 * Represents a deck that groups flashcards together.
 *
 * This is a re-exported alias of the Deck interface from vocab.ts
 * to maintain backwards compatibility.
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
