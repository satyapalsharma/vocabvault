<script setup lang="ts">
import { onMounted } from 'vue'
import { useDeckStore } from '@/stores/deck'
import { useCardStore } from '@/stores/card'
import DeckList from '@/components/DeckList.vue'

const deckStore = useDeckStore()
const cardStore = useCardStore()

onMounted(() => {
  deckStore.loadDecks()
  cardStore.loadData()
})
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>VocabVault</h1>
      <p class="subtitle">Master new words with spaced repetition</p>
    </header>

    <section class="stats-bar">
      <div class="stat">
        <span class="stat-value">{{ deckStore.deckCount }}</span>
        <span class="stat-label">Decks</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ cardStore.wordCount }}</span>
        <span class="stat-label">Words</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ cardStore.cardCount }}</span>
        <span class="stat-label">Cards</span>
      </div>
    </section>

    <DeckList :decks="deckStore.decks" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
}
.subtitle {
  color: #666;
  margin-top: 0.5rem;
}
.stats-bar {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b883;
}
.stat-label {
  font-size: 0.875rem;
  color: #666;
}
</style>
