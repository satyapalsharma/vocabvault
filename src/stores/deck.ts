import { defineStore } from 'pinia'
import type { Deck, CreateDeckInput } from '@/types'
import { generateId } from '@/lib/utils'
import { storageService } from '@/services/storage'
import { logger } from '@/lib/logger'

export const useDeckStore = defineStore('deck', {
  state: () => ({
    decks: [] as Deck[],
  }),

  getters: {
    getDeckById: (state) => (id: string) => {
      return state.decks.find((d) => d.id === id)
    },
    deckCount: (state) => state.decks.length,
  },

  actions: {
    loadDecks() {
      this.decks = storageService.getDecks()
    },

    createDeck(input: CreateDeckInput): Deck {
      const now = new Date()
      const deck: Deck = {
        id: generateId(),
        name: input.name,
        description: input.description,
        cardIds: [],
        createdAt: now,
        updatedAt: now,
      }
      this.decks.push(deck)
      this.persist()
      logger.info('Deck created', { deckId: deck.id, name: deck.name })
      return deck
    },

    updateDeck(id: string, updates: Partial<Pick<Deck, 'name' | 'description'>>): Deck {
      const deck = this.getDeckById(id)
      if (!deck) {
        throw new Error(`Deck with id ${id} not found`)
      }
      Object.assign(deck, updates, { updatedAt: new Date() })
      this.persist()
      return deck
    },

    deleteDeck(id: string): void {
      const index = this.decks.findIndex((d) => d.id === id)
      if (index === -1) {
        throw new Error(`Deck with id ${id} not found`)
      }
      this.decks.splice(index, 1)
      this.persist()
    },

    addCardToDeck(deckId: string, cardId: string): void {
      const deck = this.getDeckById(deckId)
      if (!deck) {
        throw new Error(`Deck with id ${deckId} not found`)
      }
      if (!deck.cardIds.includes(cardId)) {
        deck.cardIds.push(cardId)
        deck.updatedAt = new Date()
        this.persist()
      }
    },

    removeCardFromDeck(deckId: string, cardId: string): void {
      const deck = this.getDeckById(deckId)
      if (!deck) {
        throw new Error(`Deck with id ${deckId} not found`)
      }
      deck.cardIds = deck.cardIds.filter((id) => id !== cardId)
      deck.updatedAt = new Date()
      this.persist()
    },

    persist() {
      storageService.saveDecks(this.decks)
    },
  },
})
