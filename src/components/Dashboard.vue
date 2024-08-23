<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStats } from '@/composables/useDashboardStats'

const { totalCards, dueCards, retentionRate, statsByDeck } = useDashboardStats()

const formattedRetentionRate = computed(() => `${retentionRate.value.toFixed(1)}%`)

const hasFlashcards = computed(() => totalCards.value > 0)
const hasDecks = computed(() => statsByDeck.value.length > 0)
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard__title">Progress Dashboard</h1>

    <div v-if="!hasFlashcards" class="dashboard__empty">
      <p>No flashcards available</p>
    </div>

    <template v-else>
      <section class="dashboard__overview">
        <div class="stat-card">
          <span class="stat-card__label">Total Cards</span>
          <span class="stat-card__value">{{ totalCards }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">Due for Review</span>
          <span class="stat-card__value">{{ dueCards }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">Retention Rate</span>
          <span class="stat-card__value">{{ formattedRetentionRate }}</span>
        </div>
      </section>

      <section class="dashboard__decks">
        <h2 class="dashboard__section-title">Deck Statistics</h2>

        <div v-if="!hasDecks" class="dashboard__empty">
          <p>No decks available</p>
        </div>

        <table v-else class="decks-table">
          <thead>
            <tr>
              <th>Deck Name</th>
              <th>Total Cards</th>
              <th>Due Cards</th>
              <th>Retention Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deck in statsByDeck" :key="deck.deckId">
              <td>{{ deck.deckName }}</td>
              <td>{{ deck.totalCards }}</td>
              <td>{{ deck.dueCards }}</td>
              <td>{{ deck.retentionRate.toFixed(1) }}%</td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.dashboard__title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1f2937;
}

.dashboard__empty {
  text-align: center;
  padding: 48px 16px;
  color: #6b7280;
  font-size: 1.125rem;
}

.dashboard__overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-card__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card__value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.dashboard__section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
}

.dashboard__decks {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.decks-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.decks-table th,
.decks-table td {
  text-align: left;
  padding: 12px 8px;
  border-bottom: 1px solid #f3f4f6;
}

.decks-table th {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.decks-table td {
  color: #4b5563;
}

.decks-table tbody tr:last-child td {
  border-bottom: none;
}

.decks-table tbody tr:hover {
  background-color: #f9fafb;
}
</style>
