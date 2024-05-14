import type { Deck, Card, Word, Progress, DailyStats } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { logger } from '@/lib/logger'

export class StorageService {
  private getItem<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        return JSON.parse(item) as T
      }
    } catch (error) {
      logger.error('Failed to parse localStorage item', key, error)
    }
    return fallback
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      logger.error('Failed to set localStorage item', key, error)
    }
  }

  getDecks(): Deck[] {
    return this.getItem<Deck[]>(STORAGE_KEYS.DECKS, [])
  }

  saveDecks(decks: Deck[]): void {
    this.setItem(STORAGE_KEYS.DECKS, decks)
  }

  getCards(): Card[] {
    return this.getItem<Card[]>(STORAGE_KEYS.CARDS, [])
  }

  saveCards(cards: Card[]): void {
    this.setItem(STORAGE_KEYS.CARDS, cards)
  }

  getWords(): Word[] {
    return this.getItem<Word[]>(STORAGE_KEYS.WORDS, [])
  }

  saveWords(words: Word[]): void {
    this.setItem(STORAGE_KEYS.WORDS, words)
  }

  getProgress(): Progress {
    return this.getItem<Progress>(STORAGE_KEYS.PROGRESS, {
      totalWords: 0,
      totalDecks: 0,
      streak: 0,
      dailyStats: [],
    })
  }

  saveProgress(progress: Progress): void {
    this.setItem(STORAGE_KEYS.PROGRESS, progress)
  }

  updateDailyStats(stats: DailyStats): void {
    const progress = this.getProgress()
    const existingIndex = progress.dailyStats.findIndex(
      (s) => s.date === stats.date
    )
    if (existingIndex >= 0) {
      progress.dailyStats[existingIndex] = stats
    } else {
      progress.dailyStats.push(stats)
    }
    this.saveProgress(progress)
  }
}

export const storageService = new StorageService()
