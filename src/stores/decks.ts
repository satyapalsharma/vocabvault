import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Deck } from '@/types/deck'
import { logger } from '@/lib/logger'

export const useDeckStore = defineStore('decks', () => {
  const decks = ref<Deck[]>([])

  function addDeck(name: string, description?: string): void {
    if (!name || name.trim() === '') {
      logger.warn('Attempted to add a deck with an empty name')
      return
    }

    const newDeck: Deck = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description,
      createdAt: new Date(),
    }

    decks.value.push(newDeck)
    logger.info('Deck added', { deckId: newDeck.id, name: newDeck.name })
  }

  function getDeckById(id: string): Deck | undefined {
    return decks.value.find((deck) => deck.id === id)
  }

  return {
    decks,
    addDeck,
    getDeckById,
  }
})
