/**
 * Daily study statistics used for progress tracking.
 */
export interface DailyStats {
  /** ISO date string (YYYY-MM-DD) representing the day these stats belong to. */
  date: string
  /** Number of cards reviewed on this day. */
  reviewed: number
  /** Number of cards mastered (reached target interval) on this day. */
  mastered: number
  /** Number of new words introduced on this day. */
  newWords: number
}

/**
 * Aggregated progress data for the entire application.
 */
export interface Progress {
  /** Total number of unique words in the library. */
  totalWords: number
  /** Total number of decks created. */
  totalDecks: number
  /** Current consecutive-day study streak. */
  streak: number
  /** Chronological list of daily statistics. */
  dailyStats: DailyStats[]
}

/**
 * Statistics collected during a single review session.
 */
export interface ReviewSessionStats {
  /** Total number of cards queued for the session. */
  totalCards: number
  /** Number of cards that have been reviewed so far. */
  reviewedCards: number
  /** Number of cards answered correctly. */
  correctCards: number
  /** Number of cards answered incorrectly. */
  incorrectCards: number
  /** Timestamp when the review session began. */
  startTime: Date
  /** Optional timestamp when the review session ended. */
  endTime?: Date
}
