<script setup lang="ts">
import { reactive, computed, watch, ref } from 'vue'
import { useFlashcardStore } from '@/stores/flashcards'
import { useDeckStore } from '@/stores/deck'
import type { Flashcard } from '@/stores/flashcards'

const props = defineProps<{
  flashcard: Flashcard
}>()

const emit = defineEmits<{
  updated: [id: string]
  deleted: [id: string]
}>()

const flashcardStore = useFlashcardStore()
const deckStore = useDeckStore()

const form = reactive({
  word: '',
  definition: '',
  exampleSentence: '',
  deckId: '',
})

const errors = reactive({
  word: '',
  definition: '',
})

const submitted = ref(false)

const decks = computed(() => deckStore.decks)

const isValid = computed(() => {
  return form.word.trim() !== '' && form.definition.trim() !== ''
})

function syncForm() {
  form.word = props.flashcard.front
  form.definition = props.flashcard.back
  form.exampleSentence = props.flashcard.exampleSentence || ''
  form.deckId = props.flashcard.deckId || ''
}

watch(() => props.flashcard, syncForm, { immediate: true })

function validate(): boolean {
  errors.word = form.word.trim() === '' ? 'Word is required' : ''
  errors.definition = form.definition.trim() === '' ? 'Definition is required' : ''
  submitted.value = true
  return isValid.value
}

function onSubmit() {
  if (!validate()) return

  flashcardStore.updateFlashcard(props.flashcard.id, {
    front: form.word,
    back: form.definition,
    exampleSentence: form.exampleSentence,
    deckId: form.deckId || undefined,
  })

  emit('updated', props.flashcard.id)
}

function onDelete() {
  flashcardStore.deleteFlashcard(props.flashcard.id)
  emit('deleted', props.flashcard.id)
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="flashcard-editor">
    <div class="field">
      <label for="word">Word</label>
      <input
        id="word"
        v-model="form.word"
        type="text"
        :class="{ 'input-error': errors.word }"
        placeholder="Enter the word"
      />
      <span v-if="errors.word" class="error-message">{{ errors.word }}</span>
    </div>

    <div class="field">
      <label for="definition">Definition</label>
      <textarea
        id="definition"
        v-model="form.definition"
        :class="{ 'input-error': errors.definition }"
        placeholder="Enter the definition"
        rows="3"
      />
      <span v-if="errors.definition" class="error-message">{{ errors.definition }}</span>
    </div>

    <div class="field">
      <label for="example">Example Sentence</label>
      <input
        id="example"
        v-model="form.exampleSentence"
        type="text"
        placeholder="Enter an example sentence"
      />
    </div>

    <div class="field">
      <label for="deck">Deck</label>
      <select id="deck" v-model="form.deckId">
        <option value="">-- Select a deck --</option>
        <option v-for="deck in decks" :key="deck.id" :value="deck.id">
          {{ deck.name }}
        </option>
      </select>
    </div>

    <div class="actions">
      <button type="submit" :disabled="!isValid" class="btn-update">
        Update
      </button>
      <button type="button" @click="onDelete" class="btn-delete">
        Delete
      </button>
    </div>
  </form>
</template>

<style scoped>
.flashcard-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 480px;
  margin: 0 auto;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.field input,
.field textarea,
.field select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  color: #111827;
  background-color: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-error {
  border-color: #ef4444 !important;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
}

.error-message {
  font-size: 0.8rem;
  color: #ef4444;
  margin-top: 0.15rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-update {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.375rem;
  background-color: #3b82f6;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.btn-update:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-update:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-delete {
  padding: 0.6rem 1rem;
  border: 1px solid #ef4444;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: #ef4444;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-delete:hover {
  background-color: #ef4444;
  color: #ffffff;
}
</style>
