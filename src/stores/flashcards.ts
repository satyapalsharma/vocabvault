import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { calculateNextReview } from '@/utils/spacedRepetition'

export interface Flashcard {
  id: string
  wordId: string
  deckId: string
  reviewCount: number
  easeFactor: number
  interval: number
  lastReviewedAt?: Date
  nextReviewAt: Date
  createdAt: Date
  updatedAt: Date
}

export const useFlashcardStore = defineStore('flashcard', () => {
  const flashcards = ref<Flashcard[]>([])

  const getDueFlashcards = computed((): Flashcard[] => {
    const now = new Date()
    return flashcards.value.filter((card) => {
      const nextReview = new Date(card.nextReviewAt)
      return nextReview <= now
    })
  })

  function getDueFlashcardsFiltered(deckId?: string): Flashcard[] {
    const due = getDueFlashcards.value

    if (!deckId) {
      return due
    }

    return due.filter((card) => card.deckId === deckId)
  }

  function reviewFlashcard(id: string, quality: number): void {
    const cardIndex = flashcards.value.findIndex((card) => card.id === id)

    if (cardIndex === -1) {
      console.warn(`Flashcard with id "${id}" not found.`)
      return
    }

    const card = flashcards.value[cardIndex]
    const result = calculateNextReview(
      {
        reviewCount: card.reviewCount,
        easeFactor: card.easeFactor,
        interval: card.interval,
      },
      quality
    )

    flashcards.value[cardIndex] = {
      ...card,
      reviewCount: result.newReviewCount,
      easeFactor: result.newEaseFactor,
      interval: result.newInterval,
      lastReviewedAt: new Date(),
      nextReviewAt: result.nextReviewAt,
    }
  }

  return {
    flashcards,
    getDueFlashcards: getDueFlashcardsFiltered,
    reviewFlashcard,
  }
})
