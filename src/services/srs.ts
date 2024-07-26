import type { Card, ReviewResult, ReviewQuality, SRSConfig } from '@/types'
import { DEFAULT_SRS_CONFIG } from '@/types/srs'
import { addDays, clamp } from '@/lib/utils'

/**
 * Calculates the next review interval and ease factor for a card based on user feedback.
 *
 * Implements an SM-2-inspired spaced repetition algorithm.
 *
 * @param card - The card being reviewed, containing current SRS state.
 * @param quality - The user's recall quality rating (0–5).
 * @param config - Optional SRS configuration overrides. Defaults to {@link DEFAULT_SRS_CONFIG}.
 * @returns A ReviewResult containing the updated scheduling parameters.
 */
export function calculateReview(
  card: Card,
  quality: ReviewQuality,
  config: SRSConfig = DEFAULT_SRS_CONFIG
): ReviewResult {
  let { interval, easeFactor, repetitions } = card

  if (quality < 3) {
    repetitions = 0
    interval = config.initialInterval
  } else {
    repetitions += 1
    if (repetitions === 1) {
      interval = 1
    } else if (repetitions === 2) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
  }

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  easeFactor = clamp(easeFactor, config.minimumEaseFactor, 5)

  const nextInterval = quality >= 3 ? interval : config.initialInterval

  return {
    quality,
    nextInterval,
    nextEaseFactor: easeFactor,
    nextRepetitions: repetitions,
  }
}

/**
 * Filters a list of cards to only those that are due for review.
 *
 * @param cards - The full array of cards to evaluate.
 * @returns A new array containing only cards whose dueDate is in the past or present.
 */
export function getDueCards(cards: Card[]): Card[] {
  const now = new Date()
  return cards.filter((card) => new Date(card.dueDate) <= now)
}

/**
 * Calculates the next review date by adding an interval (in days) to the current date.
 *
 * @param interval - The number of days until the next review.
 * @returns A Date object representing the next scheduled review.
 */
export function getNextReviewDate(interval: number): Date {
  return addDays(new Date(), interval)
}
