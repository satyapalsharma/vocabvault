import { computed } from 'vue'
import { useCardStore } from '@/stores/card'
import { useDeckStore } from '@/stores/deck'
import type { Deck } from '@/types'

export interface DeckStats {
  deckId: string
  deckName: string
  totalCards: number
  dueCards: number
  retentionRate: number
}

export function useDashboardStats() {
  const cardStore = useCardStore()
  const deckStore = useDeckStore()

  const totalCards = computed(() => cardStore.cards.length)

  const dueCards = computed(() => cardStore.getDueCards.length)

  const retentionRate = computed(() => {
    const reviewedCards = cardStore.cards.filter((card) => card.lastReviewDate != null)
    if (reviewedCards.length === 0) return 0
    const successfulCards = reviewedCards.filter((card) => card.interval > 0)
    return (successfulCards.length / reviewedCards.length) * 100
  })

  const statsByDeck = computed<DeckStats[]>(() => {
    return deckStore.decks.map((deck: Deck) => {
      const deckCards = cardStore.getCardsByDeck(deck.id)
      const now = new Date()
      const total = deckCards.length
      const due = deckCards.filter((card) => new Date(card.dueDate) <= now).length

      const reviewed = deckCards.filter((card) => card.lastReviewDate != null)
      let retention = 0
      if (reviewed.length > 0) {
        const successful = reviewed.filter((card) => card.interval > 0)
        retention = (successful.length / reviewed.length) * 100
      }

      return {
        deckId: deck.id,
        deckName: deck.name,
        totalCards: total,
        dueCards: due,
        retentionRate: retention,
      }
    })
  })

  return {
    totalCards,
    dueCards,
    retentionRate,
    statsByDeck,
  }
}
