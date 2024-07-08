import { defineStore } from 'pinia'
import type { Card, Word, CreateWordInput, AddCardToDeckInput } from '@/types'
import { generateId } from '@/lib/utils'
import { storageService } from '@/services/storage'
import { calculateReview, getNextReviewDate } from '@/services/srs'
import { logger } from '@/lib/logger'

export const useCardStore = defineStore('card', {
  state: () => ({
    cards: [] as Card[],
    words: [] as Word[],
  }),

  getters: {
    getCardById: (state) => (id: string) => {
      return state.cards.find((c) => c.id === id)
    },
    getCardsByDeck: (state) => (deckId: string) => {
      return state.cards.filter((c) => c.deckId === deckId)
    },
    getWordById: (state) => (id: string) => {
      return state.words.find((w) => w.id === id)
    },
    getDueCards: (state) => {
      const now = new Date()
      return state.cards.filter((c) => new Date(c.dueDate) <= now)
    },
    cardCount: (state) => state.cards.length,
    wordCount: (state) => state.words.length,
  },

  actions: {
    loadData() {
      this.cards = storageService.getCards()
      this.words = storageService.getWords()
    },

    createWord(input: CreateWordInput): Word {
      const now = new Date()
      const word: Word = {
        id: generateId(),
        term: input.term,
        definition: input.definition,
        example: input.example,
        pronunciation: input.pronunciation,
        tags: input.tags ?? [],
        createdAt: now,
        updatedAt: now,
      }
      this.words.push(word)
      this.persist()
      logger.info('Word created', { wordId: word.id, term: word.term })
      return word
    },

    addCardToDeck(input: AddCardToDeckInput): Card {
      const word = this.words.find((w) => w.id === input.wordId)
      if (!word) {
        throw new Error(`Word with id ${input.wordId} not found`)
      }

      const existingCard = this.cards.find(
        (c) => c.wordId === input.wordId && c.deckId === input.deckId
      )
      if (existingCard) {
        throw new Error('Card already exists in this deck')
      }

      const now = new Date()
      const card: Card = {
        id: generateId(),
        wordId: input.wordId,
        deckId: input.deckId,
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        dueDate: now,
        createdAt: now,
        updatedAt: now,
      }
      this.cards.push(card)
      this.persist()
      logger.info('Card added to deck', { cardId: card.id, deckId: input.deckId })
      return card
    },

    reviewCard(cardId: string, quality: 0 | 1 | 2 | 3 | 4 | 5): Card {
      const card = this.getCardById(cardId)
      if (!card) {
        throw new Error(`Card with id ${cardId} not found`)
      }

      const result = calculateReview(card, quality)
      const now = new Date()

      card.interval = result.nextInterval
      card.easeFactor = result.nextEaseFactor
      card.repetitions = result.nextRepetitions
      card.dueDate = getNextReviewDate(result.nextInterval)
      card.lastReviewDate = now
      card.updatedAt = now

      this.persist()
      logger.info('Card reviewed', {
        cardId,
        quality,
        nextInterval: result.nextInterval,
      })
      return card
    },

    deleteCard(cardId: string): void {
      const index = this.cards.findIndex((c) => c.id === cardId)
      if (index === -1) {
        throw new Error(`Card with id ${cardId} not found`)
      }
      this.cards.splice(index, 1)
      this.persist()
    },

    deleteWord(wordId: string): void {
      const wordIndex = this.words.findIndex((w) => w.id === wordId)
      if (wordIndex === -1) {
        throw new Error(`Word with id ${wordId} not found`)
      }
      this.words.splice(wordIndex, 1)
      const relatedCards = this.cards.filter((c) => c.wordId === wordId)
      relatedCards.forEach((c) => {
        const idx = this.cards.indexOf(c)
        if (idx >= 0) this.cards.splice(idx, 1)
      })
      this.persist()
    },

    setFlashcards(flashcards: Card[]): void {
      this.cards = flashcards
      this.persist()
    },

    persist() {
      storageService.saveCards(this.cards)
      storageService.saveWords(this.words)
    },
  },
})
