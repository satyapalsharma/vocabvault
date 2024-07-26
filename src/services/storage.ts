import type { Deck, Card, Word, Progress, DailyStats } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { logger } from '@/lib/logger'

/**
 * Service for persisting and retrieving application data from localStorage.
 */
export class StorageService {
  /**
   * Retrieves an item from localStorage with type safety and fallback support.
   * @template T - The expected type of the stored value.
   * @param key - The localStorage key to retrieve.
   * @param fallback - The value to return if the key is missing or parsing fails.
   * @returns The parsed value or the fallback.
   */
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

  /**
   * Persists a value to localStorage as JSON.
   * @template T - The type of the value to store.
   * @param key - The localStorage key to set.
   * @param value - The value to serialize and store.
   */
  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      logger.error('Failed to set localStorage item', key, error)
    }
  }

  /**
   * Retrieves all decks from localStorage.
   * @returns An array of Deck objects.
   */
  getDecks(): Deck[] {
    return this.getItem<Deck[]>(STORAGE_KEYS.DECKS, [])
  }

  /**
   * Persists the full deck collection to localStorage.
   * @param decks - The array of decks to save.
   */
  saveDecks(decks: Deck[]): void {
    this.setItem(STORAGE_KEYS.DECKS, decks)
  }

  /**
   * Retrieves all cards from localStorage.
   * @returns An array of Card objects.
   */
  getCards(): Card[] {
    return this.getItem<Card[]>(STORAGE_KEYS.CARDS, [])
  }

  /**
   * Persists the full card collection to localStorage.
   * @param cards - The array of cards to save.
   */
  saveCards(cards: Card[]): void {
    this.setItem(STORAGE_KEYS.CARDS, cards)
  }

  /**
   * Retrieves all words from localStorage.
   * @returns An array of Word objects.
   */
  getWords(): Word[] {
    return this.getItem<Word[]>(STORAGE_KEYS.WORDS, [])
  }

  /**
   * Persists the full word collection to localStorage.
   * @param words - The array of words to save.
   */
  saveWords(words: Word[]): void {
    this.setItem(STORAGE_KEYS.WORDS, words)
  }

  /**
   * Retrieves progress tracking data from localStorage.
   * @returns A Progress object with default values if none exists.
   */
  getProgress(): Progress {
    return this.getItem<Progress>(STORAGE_KEYS.PROGRESS, {
      totalWords: 0,
      totalDecks: 0,
      streak: 0,
      dailyStats: [],
    })
  }

  /**
   * Persists progress tracking data to localStorage.
   * @param progress - The Progress object to save.
   */
  saveProgress(progress: Progress): void {
    this.setItem(STORAGE_KEYS.PROGRESS, progress)
  }

  /**
   * Updates or appends daily statistics for a specific date.
   * @param stats - The DailyStats object to upsert into the progress record.
   */
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

/**
 * Singleton instance of the storage service.
 */
export const storageService = new StorageService()
