import type { Deck, Card } from '@/types/vocab'

export type Flashcard = Card

/**
 * Exports decks and flashcards to a formatted JSON string.
 */
export function exportToJSON(data: { decks: Deck[]; flashcards: Flashcard[] }): string {
  if (data.decks.length === 0 && data.flashcards.length === 0) {
    return JSON.stringify({ decks: [], flashcards: [] }, null, 2)
  }
  return JSON.stringify(data, null, 2)
}

/**
 * Imports and validates a JSON string into decks and flashcards arrays.
 * @throws Error if JSON is invalid or if decks/flashcards are not arrays.
 */
export function importFromJSON(json: string): { decks: Deck[]; flashcards: Flashcard[] } {
  if (!json || json.trim().length === 0) {
    return { decks: [], flashcards: [] }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch (e) {
    throw new Error(`Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`)
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Invalid JSON: root must be an object')
  }

  const obj = parsed as Record<string, unknown>

  if (!Array.isArray(obj.decks)) {
    throw new Error('Invalid JSON: "decks" must be an array')
  }

  if (!Array.isArray(obj.flashcards)) {
    throw new Error('Invalid JSON: "flashcards" must be an array')
  }

  return {
    decks: obj.decks as Deck[],
    flashcards: obj.flashcards as Flashcard[],
  }
}

/**
 * Escapes a CSV field value according to RFC 4180.
 * Wraps fields containing commas, quotes, or newlines in double quotes
 * and escapes internal quotes by doubling them.
 */
function escapeCsvField(value: string): string {
  const needsQuoting = value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')

  if (!needsQuoting) {
    return value
  }

  const escaped = value.replace(/"/g, '""')
  return `"${escaped}"`
}

/**
 * Exports flashcards to a CSV string with standardized headers.
 * Handles empty input by returning an empty string.
 */
export function exportToCSV(flashcards: Flashcard[]): string {
  if (flashcards.length === 0) {
    return ''
  }

  const headers = [
    'id',
    'word',
    'definition',
    'exampleSentence',
    'deckId',
    'createdAt',
    'reviewCount',
    'lastReviewedAt',
    'nextReviewAt',
    'easeFactor',
    'interval',
  ]

  const rows: string[] = [headers.join(',')]

  for (const card of flashcards) {
    const fields = [
      card.id,
      '', // word - not available on Card type
      '', // definition - not available on Card type
      '', // exampleSentence - not available on Card type
      card.deckId,
      card.createdAt instanceof Date ? card.createdAt.toISOString() : String(card.createdAt),
      String(card.repetitions),
      card.lastReviewDate instanceof Date ? card.lastReviewDate.toISOString() : card.lastReviewDate ? String(card.lastReviewDate) : '',
      card.dueDate instanceof Date ? card.dueDate.toISOString() : String(card.dueDate),
      String(card.easeFactor),
      String(card.interval),
    ]

    const escapedFields = fields.map(escapeCsvField)
    rows.push(escapedFields.join(','))
  }

  return rows.join('\n')
}

/**
 * Parses a CSV string into an array of Flashcard objects.
 * Handles quoted fields with escaped quotes and converts date strings to Date objects.
 * Invalid dates are replaced with new Date().
 * Returns an empty array for empty or whitespace-only input.
 */
export function importFromCSV(csv: string): Flashcard[] {
  if (!csv || csv.trim().length === 0) {
    return []
  }

  const lines = csv.split(/\r?\n/)
  if (lines.length === 0) {
    return []
  }

  const headers = parseCsvLine(lines[0])
  if (headers.length === 0) {
    return []
  }

  const result: Flashcard[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.length === 0) {
      continue
    }

    const values = parseCsvLine(line)
    if (values.length === 0) {
      continue
    }

    const card: Partial<Flashcard> = {}

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]!
      const value = values[j] ?? ''

      switch (header) {
        case 'id':
          card.id = value
          break
        case 'deckId':
          card.deckId = value
          break
        case 'createdAt': {
          const date = new Date(value)
          card.createdAt = isNaN(date.getTime()) ? new Date() : date
          break
        }
        case 'reviewCount':
          card.repetitions = parseInt(value, 10) || 0
          break
        case 'lastReviewedAt': {
          const date = new Date(value)
          card.lastReviewDate = isNaN(date.getTime()) ? undefined : date
          break
        }
        case 'nextReviewAt': {
          const date = new Date(value)
          card.dueDate = isNaN(date.getTime()) ? new Date() : date
          break
        }
        case 'easeFactor':
          card.easeFactor = parseFloat(value) || 2.5
          break
        case 'interval':
          card.interval = parseInt(value, 10) || 1
          break
        // word, definition, exampleSentence are not stored on Card
        default:
          break
      }
    }

    // Ensure required fields are present
    if (card.id && card.deckId) {
      result.push(card as Flashcard)
    }
  }

  return result
}

/**
 * Parses a single CSV line into an array of field values.
 * Handles quoted fields with escaped quotes (doubled quotes).
 */
function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]!

    if (inQuotes) {
      if (char === '"') {
        // Check if next char is also a quote (escaped quote)
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"'
          i++ // skip next quote
        } else {
          // End of quoted field
          inQuotes = false
        }
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        fields.push(current)
        current = ''
      } else {
        current += char
      }
    }
  }

  // Push the last field
  fields.push(current)

  return fields
}
