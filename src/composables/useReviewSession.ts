import { ref, computed } from 'vue'

export interface Flashcard {
  id: string
  wordId: string
  term: string
  definition: string
  example?: string
  pronunciation?: string
  tags: string[]
  interval: number
  easeFactor: number
  repetitions: number
  dueDate: Date
  lastReviewDate?: Date
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function useReviewSession(flashcards: Flashcard[]) {
  const currentIndex = ref(0)
  const isFlipped = ref(false)

  const currentCard = computed<Flashcard | null>(() => {
    if (flashcards.length === 0) return null
    return flashcards[currentIndex.value] ?? null
  })

  const hasNext = computed<boolean>(() => {
    return currentIndex.value < flashcards.length - 1
  })

  function nextCard(): void {
    if (currentIndex.value < flashcards.length - 1) {
      currentIndex.value++
      isFlipped.value = false
    }
  }

  function flipCard(): void {
    isFlipped.value = !isFlipped.value
  }

  return {
    currentCard,
    currentIndex,
    isFlipped,
    nextCard,
    flipCard,
    hasNext,
  }
}
