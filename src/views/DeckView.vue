<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeckStore } from '@/stores/deck'
import { useCardStore } from '@/stores/card'

const route = useRoute()
const router = useRouter()
const deckStore = useDeckStore()
const cardStore = useCardStore()

const deckId = computed(() => route.params.id as string)
const deck = computed(() => deckStore.getDeckById(deckId.value))
const cards = computed(() => cardStore.getCardsByDeck(deckId.value))

onMounted(() => {
  deckStore.loadDecks()
  cardStore.loadData()
})

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="deck-view">
    <div v-if="!deck" class="not-found">
      <h2>Deck not found</h2>
      <button @click="goBack" class="btn-primary">Back to Dashboard</button>
    </div>

    <div v-else>
      <header class="deck-header">
        <button @click="goBack" class="btn-back">&larr; Back</button>
        <div>
          <h1>{{ deck.name }}</h1>
          <p v-if="deck.description" class="deck-description">{{ deck.description }}</p>
        </div>
      </header>

      <section class="deck-stats">
        <span>{{ cards.length }} cards</span>
      </section>

      <section class="card-list">
        <div v-if="cards.length === 0" class="empty-state">
          <p>No cards in this deck yet.</p>
        </div>
        <div v-for="card in cards" :key="card.id" class="card-item">
          <div class="card-word">
            {{ cardStore.getWordById(card.wordId)?.term ?? 'Unknown' }}
          </div>
          <div class="card-meta">
            Due: {{ new Date(card.dueDate).toLocaleDateString() }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.deck-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.deck-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.btn-back {
  background: none;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}
.deck-description {
  color: #666;
  margin-top: 0.25rem;
}
.deck-stats {
  margin-bottom: 1rem;
  color: #666;
}
.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.card-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-word {
  font-weight: 500;
}
.card-meta {
  font-size: 0.875rem;
  color: #666;
}
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}
.not-found {
  text-align: center;
  padding: 4rem 1rem;
}
.btn-primary {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
