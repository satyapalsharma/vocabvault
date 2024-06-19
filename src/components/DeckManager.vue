<script setup lang="ts">
import { ref } from 'vue'
import { useDeckStore } from '@/stores/decks'
import type { Deck } from '@/types/deck'

const emit = defineEmits<{
  (e: 'deckAdded', deck: Deck): void
}>()

const deckStore = useDeckStore()

const name = ref('')
const description = ref('')
const error = ref('')

const isNameEmpty = () => name.value.trim().length === 0

const handleSubmit = () => {
  if (isNameEmpty()) {
    error.value = 'Deck name is required.'
    return
  }

  deckStore.addDeck(name.value.trim(), description.value.trim() || undefined)

  const addedDeck = deckStore.decks[deckStore.decks.length - 1]
  if (addedDeck) {
    emit('deckAdded', addedDeck)
  }

  name.value = ''
  description.value = ''
  error.value = ''
}
</script>

<template>
  <div class="deck-manager">
    <section class="deck-list">
      <h2>Your Decks</h2>
      <ul v-if="deckStore.decks.length > 0" class="decks">
        <li v-for="deck in deckStore.decks" :key="deck.id" class="deck-item">
          <span class="deck-name">{{ deck.name }}</span>
          <span v-if="deck.description" class="deck-description">
            {{ deck.description }}
          </span>
        </li>
      </ul>
      <p v-else class="empty-state">No decks yet. Create your first deck below.</p>
    </section>

    <section class="deck-form">
      <h2>Add New Deck</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="deck-name">Name</label>
          <input
            id="deck-name"
            v-model="name"
            type="text"
            placeholder="Enter deck name"
            @input="error = ''"
          />
        </div>

        <div class="form-group">
          <label for="deck-description">Description</label>
          <textarea
            id="deck-description"
            v-model="description"
            placeholder="Optional description"
            rows="3"
          />
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <button type="submit" :disabled="isNameEmpty()" class="submit-btn">
          Add Deck
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.deck-manager {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, -apple-system, sans-serif;
}

.deck-list h2,
.deck-form h2 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.decks {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.deck-item {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  background: #f9fafb;
}

.deck-name {
  font-weight: 700;
  color: #111827;
  font-size: 1rem;
}

.deck-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.empty-state {
  color: #9ca3af;
  font-style: italic;
  margin-bottom: 2rem;
}

.deck-form {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0.5rem 0;
}

.submit-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
