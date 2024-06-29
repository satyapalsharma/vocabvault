import { defineStore } from 'pinia'
import type { Flashcard } from '@/types'
import { logger } from '@/lib/logger'

export const useFlashcardStore = defineStore('flashcard', {
  state: (): { flashcards: Flashcard[] } => ({
    flashcards: [],
  }),

  getters: {
    getFlashcardsByDeck: (state) => (deckId: string): Flashcard[] => {
      return state.flashcards.filter((f) => f.deckId === deckId)
    },
    flashcardCount: (state) => state.flashcards.length,
  },

  actions: {
    addFlashcard(
      word: string,
      definition: string,
      exampleSentence: string | undefined,
      deckId: string
    ): void {
      if (!deckId) {
        logger.warn('Adding flashcard with empty deckId', { word })
      }

      const now = new Date()
      const flashcard: Flashcard = {
        id: crypto.randomUUID(),
        word,
        definition,
        exampleSentence,
        deckId,
        createdAt: now,
        reviewCount: 0,
        lastReviewedAt: null,
        nextReviewAt: now,
        easeFactor: 2.5,
        interval: 0,
      }

      this.flashcards.push(flashcard)
      logger.info('Flashcard added', {
        flashcardId: flashcard.id,
        word,
        deckId,
      })
    },
  },
})
