<script setup lang="ts">
import { ref } from 'vue'
import { useDeckStore } from '@/stores/deck'
import { useCardStore } from '@/stores/card'
import { exportToJSON, importFromJSON, exportToCSV, importFromCSV } from '@/utils/importExport'
import type { Flashcard } from '@/utils/importExport'
import type { Deck } from '@/types'

const emit = defineEmits<{
  imported: []
}>()

const deckStore = useDeckStore()
const cardStore = useCardStore()

const errorMessage = ref<string | null>(null)
const importInput = ref<HTMLInputElement | null>(null)

function showError(message: string): void {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = null
  }, 5000)
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function handleExportJSON(): void {
  const decks = deckStore.decks
  const flashcards = cardStore.cards as Flashcard[]
  const json = exportToJSON({ decks, flashcards })
  downloadFile(json, 'vocabvault-export.json', 'application/json')
}

function handleExportCSV(): void {
  const flashcards = cardStore.cards as Flashcard[]
  const csv = exportToCSV(flashcards)
  if (csv.length === 0) {
    showError('No flashcards to export.')
    return
  }
  downloadFile(csv, 'vocabvault-export.csv', 'text/csv')
}

async function handleImport(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  errorMessage.value = null

  try {
    const content = await file.text()
    const extension = file.name.split('.').pop()?.toLowerCase()

    if (extension === 'json') {
      const { decks, flashcards } = importFromJSON(content)
      deckStore.setDecks(decks as Deck[])
      cardStore.setFlashcards(flashcards as Flashcard[])
    } else if (extension === 'csv') {
      const flashcards = importFromCSV(content)
      cardStore.setFlashcards(flashcards)
    } else {
      showError('Unsupported file format. Please select a .json or .csv file.')
      return
    }

    emit('imported')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to import file.'
    showError(message)
  } finally {
    if (importInput.value) {
      importInput.value.value = ''
    }
  }
}

function triggerImport(): void {
  importInput.value?.click()
}
</script>

<template>
  <div class="import-export">
    <div class="button-group">
      <button type="button" class="btn btn-primary" @click="handleExportJSON">
        Export JSON
      </button>
      <button type="button" class="btn btn-secondary" @click="handleExportCSV">
        Export CSV
      </button>
      <button type="button" class="btn btn-accent" @click="triggerImport">
        Import
      </button>
      <input
        ref="importInput"
        type="file"
        accept=".json,.csv"
        class="hidden-input"
        @change="handleImport"
      />
    </div>

    <div v-if="errorMessage" class="error-message" role="alert">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.import-export {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.hidden-input {
  display: none;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
}

.btn:hover {
  opacity: 0.9;
}

.btn:active {
  opacity: 0.8;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-accent {
  background-color: #10b981;
  color: white;
}

.error-message {
  padding: 0.75rem 1rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}
</style>
