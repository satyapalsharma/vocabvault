import { describe, it, expect } from 'vitest'
import { generateId, formatDate, isToday, addDays, clamp } from '@/lib/utils'

describe('utils', () => {
  it('generateId returns a non-empty string', () => {
    const id = generateId()
    expect(id).toBeDefined()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('generateId returns unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })

  it('formatDate returns a formatted date string', () => {
    const date = new Date('2024-01-15')
    const formatted = formatDate(date)
    expect(formatted).toContain('Jan')
    expect(formatted).toContain('15')
    expect(formatted).toContain('2024')
  })

  it('isToday returns true for today and false for other days', () => {
    expect(isToday(new Date())).toBe(true)
    expect(isToday(new Date('2020-01-01'))).toBe(false)
  })

  it('addDays adds the correct number of days', () => {
    const date = new Date('2024-01-01')
    const result = addDays(date, 5)
    expect(result.getDate()).toBe(6)
  })

  it('clamp constrains values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })
})
