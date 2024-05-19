<script setup lang="ts">
import { computed } from 'vue'
import type { Deck } from '@/types'
import { useRouter } from 'vue-router'
import { useCardStore } from '@/stores/card'

const props = defineProps<{ decks: Deck[] }>()
const router = useRouter()
const cardStore = useCardStore()

function getCardCount(deckId: string): number {
  return cardStore.getCardsByDeck(deckId).length
}

function navigateToDeck(deckId: string) {
  router.push(`/deck/${deckId}`)
}

function navigateToReview() {
  router.push('/review')
}
</script>

<template>
  <div class="deck-list">
    <div v-if="decks.length === 0" class="empty-state">
      <p>No decks yet. Create your first deck to get started!</p>
    </div>

    <div v-for="deck in decks" :key="deck.id" class="deck-item" @click="navigateToDeck(deck.id)">
      <div class="deck-info">
        <h3>{{ deck.name }}</h3>
        <p v-if="deck.description" class="deck-description">{{ deck.description }}</p>
        <span class="card-count">{{ getCardCount(deck.id) }} cards</span>
      </div>
    </div>

    <button @click="navigateToReview" class="btn-review" :disabled="cardStore.cardCount === 0">
      Start Review Session
    </button>
  </div>
</template>

<style scoped>
.deck-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  border: 2px dashed #e5e7eb;
  border-radius: 0.5rem;
}
.deck-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.deck-item:hover {
  border-color: #42b883;
  box-shadow: 0 2px 8px rgba(66, 184, 131, 0.1);
}
.deck-info h3 {
  margin: 0 0 0.25rem 0;
}
.deck-description {
  color: #666;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}
.card-count {
  font-size: 0.75rem;
  color: #42b883;
  font-weight: 500;
}
.btn-review {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}
.btn-review:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.btn-review:not(:disabled):hover {
  background: #33a06f;
}
</style>
