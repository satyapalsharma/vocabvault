import type { Card, ReviewResult, ReviewQuality, SRSConfig } from '@/types'
import { DEFAULT_SRS_CONFIG } from '@/types/srs'
import { addDays, clamp } from '@/lib/utils'

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

export function getDueCards(cards: Card[]): Card[] {
  const now = new Date()
  return cards.filter((card) => new Date(card.dueDate) <= now)
}

export function getNextReviewDate(interval: number): Date {
  return addDays(new Date(), interval)
}
