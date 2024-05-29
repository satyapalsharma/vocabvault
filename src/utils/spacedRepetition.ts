export interface Card {
  reviewCount: number
  easeFactor: number
  interval: number
}

export interface ReviewResult {
  nextReviewAt: Date
  newEaseFactor: number
  newInterval: number
  newReviewCount: number
}

export function calculateNextReview(
  card: Card,
  quality: number
): ReviewResult {
  const clampedQuality = Math.max(0, Math.min(5, quality))

  let newReviewCount: number
  let newInterval: number

  if (clampedQuality < 3) {
    newReviewCount = 0
    newInterval = 1
  } else {
    newReviewCount = card.reviewCount + 1

    if (card.reviewCount === 0) {
      newInterval = 1
    } else if (card.reviewCount === 1) {
      newInterval = 6
    } else {
      newInterval = card.interval * card.easeFactor
    }
  }

  const easeFactorDelta =
    0.1 - (5 - clampedQuality) * (0.08 + (5 - clampedQuality) * 0.02)
  const newEaseFactor = Math.max(1.3, card.easeFactor + easeFactorDelta)

  const nextReviewAt = new Date(
    Date.now() + newInterval * 24 * 60 * 60 * 1000
  )

  return {
    nextReviewAt,
    newEaseFactor,
    newInterval,
    newReviewCount,
  }
}
