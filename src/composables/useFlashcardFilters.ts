import { ref, computed } from 'vue'

export interface Flashcard {
  id: string
  wordId: string
  deckId: string
  word: string
  definition: string
  dueDate: Date
  repetitions: number
}

export function useFlashcardFilters(flashcards: Flashcard[]) {
  const searchQuery = ref('')
  const selectedDeckId = ref<string | null>(null)
  const reviewStatusFilter = ref<'all' | 'due' | 'reviewed' | 'new'>('all')

  const normalizedQuery = computed(() => {
    const trimmed = searchQuery.value.trim()
    return trimmed.length > 0 ? trimmed.toLowerCase() : ''
  })

  const filteredFlashcards = computed(() => {
    return flashcards.filter((card) => {
      if (normalizedQuery.value) {
        const matchesWord = card.word.toLowerCase().includes(normalizedQuery.value)
        const matchesDefinition = card.definition.toLowerCase().includes(normalizedQuery.value)
        if (!matchesWord && !matchesDefinition) {
          return false
        }
      }

      if (selectedDeckId.value !== null && card.deckId !== selectedDeckId.value) {
        return false
      }

      if (reviewStatusFilter.value === 'due') {
        if (new Date(card.dueDate) > new Date()) {
          return false
        }
      } else if (reviewStatusFilter.value === 'reviewed') {
        if (card.repetitions === 0) {
          return false
        }
      } else if (reviewStatusFilter.value === 'new') {
        if (card.repetitions > 0) {
          return false
        }
      }

      return true
    })
  })

  return {
    searchQuery,
    selectedDeckId,
    reviewStatusFilter,
    filteredFlashcards,
  }
}
