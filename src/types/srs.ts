/**
 * Configuration parameters for the spaced repetition algorithm.
 */
export interface SRSConfig {
  /** Starting interval (in days) for new or lapsed cards. */
  initialInterval: number
  /** Multiplier applied to the interval when a card is rated easy. */
  easyBonus: number
  /** Multiplier applied to the interval when a card is rated hard. */
  hardFactor: number
  /** Penalty factor applied to the ease factor after a lapse. */
  lapsePenalty: number
  /** Minimum allowed ease factor to prevent intervals from shrinking indefinitely. */
  minimumEaseFactor: number
}

/**
 * Result of a spaced repetition review calculation.
 */
export interface ReviewResult {
  /** The quality rating provided by the user for this review. */
  quality: number
  /** Calculated number of days until the next review. */
  nextInterval: number
  /** Updated ease factor to be stored on the card. */
  nextEaseFactor: number
  /** Updated repetition count to be stored on the card. */
  nextRepetitions: number
}

/**
 * User recall quality rating on a 0–5 scale.
 *
 * - 0: Complete blackout
 * - 1: Incorrect response; correct one remembered
 * - 2: Incorrect response; the correct answer seemed easy to recall
 * - 3: Correct response recalled with serious difficulty
 * - 4: Correct response after a hesitation
 * - 5: Perfect recall
 */
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5

/** Default configuration values for the spaced repetition algorithm. */
export const DEFAULT_SRS_CONFIG: SRSConfig = {
  initialInterval: 1,
  easyBonus: 1.3,
  hardFactor: 1.2,
  lapsePenalty: 0.2,
  minimumEaseFactor: 1.3,
}
