import { describe, it, expect } from 'vitest'
import { calculateReview, getDueCards, getNextReviewDate } from '@/services/srs'
import type { Card } from '@/types'

describe('srs', () => {
  const createCard = (overrides: Partial<Card> = {}): Card => ({
    id: 'card-1',
    wordId: 'word-1',
    deckId: 'deck-1',
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  })

  it('calculateReview returns correct result for quality 3', () => {
    const card = createCard({ repetitions: 1 })
    const result = calculateReview(card, 3)
    expect(result.quality).toBe(3)
    expect(result.nextRepetitions).toBe(2)
    expect(result.nextInterval).toBeGreaterThanOrEqual(1)
  })

  it('calculateReview resets repetitions for quality < 3', () => {
    const card = createCard({ repetitions: 3, interval: 10 })
    const result = calculateReview(card, 1)
    expect(result.nextRepetitions).toBe(0)
    expect(result.nextInterval).toBe(1)
  })

  it('calculateReview increases easeFactor for high quality', () => {
    const card = createCard({ easeFactor: 2.5 })
    const result = calculateReview(card, 5)
    expect(result.nextEaseFactor).toBeGreaterThan(2.5)
  })

  it('calculateReview decreases easeFactor for low quality', () => {
    const card = createCard({ easeFactor: 2.5 })
    const result = calculateReview(card, 0)
    expect(result.nextEaseFactor).toBeLessThan(2.5)
  })

  it('getDueCards returns cards that are due', () => {
    const now = new Date()
    const dueCard = createCard({ dueDate: new Date(now.getTime() - 1000) })
    const futureCard = createCard({ id: 'card-2', dueDate: new Date(now.getTime() + 100000) })
    const due = getDueCards([dueCard, futureCard])
    expect(due).toHaveLength(1)
    expect(due[0].id).toBe('card-1')
  })

  it('getNextReviewDate returns a date in the future', () => {
    const now = new Date()
    const next = getNextReviewDate(3)
    expect(next.getTime()).toBeGreaterThan(now.getTime())
  })
})
