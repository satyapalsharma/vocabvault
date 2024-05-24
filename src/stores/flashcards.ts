import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Flashcard {
  id: string
  front: string
  back: string
  deckId?: string
  createdAt: Date
  updatedAt: Date
}

export const useFlashcardStore = defineStore('flashcard', () => {
  const flashcards = ref<Flashcard[]>([])

  function updateFlashcard(id: string, updates: Partial<Omit<Flashcard, 'id'>>): void {
    const index = flashcards.value.findIndex((card) => card.id === id)

    if (index === -1) {
      console.warn(`Flashcard with id "${id}" not found. Update ignored.`)
      return
    }

    const { id: _, ...safeUpdates } = updates as Partial<Flashcard>
    flashcards.value[index] = {
      ...flashcards.value[index],
      ...safeUpdates,
      updatedAt: new Date(),
    }
  }

  function deleteFlashcard(id: string): void {
    const initialLength = flashcards.value.length
    flashcards.value = flashcards.value.filter((card) => card.id !== id)

    if (flashcards.value.length === initialLength) {
      console.warn(`Flashcard with id "${id}" not found. Delete ignored.`)
    }
  }

  return {
    flashcards,
    updateFlashcard,
    deleteFlashcard,
  }
})
