import { defineStore } from 'pinia'
import type { Card, ReviewSessionStats } from '@/types'
import { useCardStore } from './card'
import { getDueCards } from '@/services/srs'
import { storageService } from '@/services/storage'
import { logger } from '@/lib/logger'

export const useReviewStore = defineStore('review', {
  state: () => ({
    sessionCards: [] as Card[],
    currentIndex: 0,
    isActive: false,
    stats: null as ReviewSessionStats | null,
  }),

  getters: {
    currentCard: (state) => state.sessionCards[state.currentIndex] ?? null,
    isSessionComplete: (state) => state.currentIndex >= state.sessionCards.length,
    progress: (state) => {
      if (state.sessionCards.length === 0) return 0
      return Math.round((state.currentIndex / state.sessionCards.length) * 100)
    },
  },

  actions: {
    startSession(deckId?: string) {
      const cardStore = useCardStore()
      cardStore.loadData()

      let cards: Card[]
      if (deckId) {
        cards = cardStore.getCardsByDeck(deckId)
      } else {
        cards = cardStore.cards
      }

      this.sessionCards = getDueCards(cards)
      this.currentIndex = 0
      this.isActive = this.sessionCards.length > 0
      this.stats = {
        totalCards: this.sessionCards.length,
        reviewedCards: 0,
        correctCards: 0,
        incorrectCards: 0,
        startTime: new Date(),
      }

      logger.info('Review session started', {
        cardCount: this.sessionCards.length,
        deckId,
      })
    },

    reviewCurrentCard(quality: 0 | 1 | 2 | 3 | 4 | 5): Card | null {
      if (!this.currentCard) return null

      const cardStore = useCardStore()
      const reviewedCard = cardStore.reviewCard(this.currentCard.id, quality)

      if (this.stats) {
        this.stats.reviewedCards += 1
        if (quality >= 3) {
          this.stats.correctCards += 1
        } else {
          this.stats.incorrectCards += 1
        }
      }

      this.currentIndex += 1
      return reviewedCard
    },

    endSession() {
      if (this.stats) {
        this.stats.endTime = new Date()
        storageService.saveProgress({
          totalWords: useCardStore().words.length,
          totalDecks: 0,
          streak: 0,
          dailyStats: [],
        })
      }
      this.isActive = false
      this.sessionCards = []
      this.currentIndex = 0
      logger.info('Review session ended', this.stats)
    },

    skipSession() {
      this.isActive = false
      this.sessionCards = []
      this.currentIndex = 0
    },
  },
})
