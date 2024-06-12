<template>
  <form @submit.prevent="handleSubmit" class="add-word-form">
    <h2 class="form-title">Add New Flashcard</h2>

    <div class="form-group">
      <label for="word" class="form-label">Word *</label>
      <input
        id="word"
        v-model="form.word"
        type="text"
        class="form-input"
        placeholder="Enter a word"
        @blur="touched.word = true"
      />
      <p v-if="touched.word && errors.word" class="form-error">{{ errors.word }}</p>
    </div>

    <div class="form-group">
      <label for="definition" class="form-label">Definition *</label>
      <textarea
        id="definition"
        v-model="form.definition"
        class="form-input form-textarea"
        placeholder="Enter the definition"
        rows="3"
        @blur="touched.definition = true"
      />
      <p v-if="touched.definition && errors.definition" class="form-error">{{ errors.definition }}</p>
    </div>

    <div class="form-group">
      <label for="exampleSentence" class="form-label">Example Sentence</label>
      <input
        id="exampleSentence"
        v-model="form.exampleSentence"
        type="text"
        class="form-input"
        placeholder="Enter an example sentence (optional)"
      />
    </div>

    <div class="form-group">
      <label for="deck" class="form-label">Deck *</label>
      <select
        id="deck"
        v-model="form.deckId"
        class="form-input form-select"
        :disabled="decks.length === 0"
        @blur="touched.deckId = true"
      >
        <option value="" disabled>Select a deck</option>
        <option v-for="deck in decks" :key="deck.id" :value="deck.id">
          {{ deck.name }}
        </option>
      </select>
      <p v-if="touched.deckId && errors.deckId" class="form-error">{{ errors.deckId }}</p>
      <p v-if="decks.length === 0" class="form-hint">No decks available. Create a deck first.</p>
    </div>

    <button
      type="submit"
      class="submit-btn"
      :disabled="!isFormValid"
    >
      Add Flashcard
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useFlashcardStore } from '@/stores/flashcards'
import { useDeckStore } from '@/stores/deck'
import type { Deck } from '@/types'

const emit = defineEmits<{
  (e: 'submitted'): void
}>()

const flashcardStore = useFlashcardStore()
const deckStore = useDeckStore()

const decks = computed<Deck[]>(() => deckStore.decks)

const form = reactive({
  word: '',
  definition: '',
  exampleSentence: '',
  deckId: '',
})

const touched = reactive({
  word: false,
  definition: false,
  deckId: false,
})

const errors = reactive({
  word: '',
  definition: '',
  deckId: '',
})

const validate = (): boolean => {
  let isValid = true

  if (!form.word.trim()) {
    errors.word = 'Word is required'
    isValid = false
  } else {
    errors.word = ''
  }

  if (!form.definition.trim()) {
    errors.definition = 'Definition is required'
    isValid = false
  } else {
    errors.definition = ''
  }

  if (!form.deckId) {
    errors.deckId = 'Please select a deck'
    isValid = false
  } else {
    errors.deckId = ''
  }

  return isValid
}

const isFormValid = computed(() => {
  return (
    form.word.trim().length > 0 &&
    form.definition.trim().length > 0 &&
    form.deckId.length > 0
  )
})

const resetForm = (): void => {
  form.word = ''
  form.definition = ''
  form.exampleSentence = ''
  form.deckId = ''
  touched.word = false
  touched.definition = false
  touched.deckId = false
  errors.word = ''
  errors.definition = ''
  errors.deckId = ''
}

const handleSubmit = (): void => {
  if (!validate()) {
    return
  }

  flashcardStore.addFlashcard(
    form.word.trim(),
    form.definition.trim(),
    form.exampleSentence.trim() || undefined,
    form.deckId
  )

  resetForm()
  emit('submitted')
}
</script>

<style scoped>
.add-word-form {
  max-width: 480px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.25rem 0;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #111827;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.form-input:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25rem 1.25rem;
  padding-right: 2.5rem;
}

.form-error {
  margin-top: 0.375rem;
  font-size: 0.8rem;
  color: #dc2626;
}

.form-hint {
  margin-top: 0.375rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #ffffff;
  background-color: #4f46e5;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #4338ca;
}

.submit-btn:active:not(:disabled) {
  background-color: #3730a3;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
