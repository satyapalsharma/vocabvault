<script setup lang="ts">
import { computed } from 'vue'
import { useDeckStore } from '@/stores/deck'
import { useFlashcardFilters } from '@/composables/useFlashcardFilters'
import type { Flashcard } from '@/composables/useFlashcardFilters'

// ── Props ────────────────────────────────────────────────────────────────────
interface Props {
  flashcards: Flashcard[]
}
defineProps<Props>()

// ── Deck store ───────────────────────────────────────────────────────────────
const deckStore = useDeckStore()

// ── Filter composable ────────────────────────────────────────────────────────
const {
  searchQuery,
  selectedDeckId,
  reviewStatusFilter,
  filteredFlashcards,
} = useFlashcardFilters(props.flashcards)

// ── Derived deck name lookup ─────────────────────────────────────────────────
const getDeckName = (deckId: string): string => {
  const deck = deckStore.getDeckById(deckId)
  return deck?.name ?? 'Unknown Deck'
}

// ── Deck options for the select ──────────────────────────────────────────────
const deckOptions = computed(() => deckStore.decks)
</script>

<template>
  <div class="flashcard-browser">
    <!-- ── Filter controls ──────────────────────────────────────────────── -->
    <div class="filter-bar">
      <div class="filter-group">
        <label for="search-input" class="filter-label">Search</label>
        <input
          id="search-input"
          v-model="searchQuery"
          type="text"
          placeholder="Search by word or definition"
          class="search-input"
        />
      </div>

      <div class="filter-group">
        <label for="deck-select" class="filter-label">Deck</label>
        <select id="deck-select" v-model="selectedDeckId" class="filter-select">
          <option value="">All Decks</option>
          <option
            v-for="deck in deckOptions"
            :key="deck.id"
            :value="deck.id"
          >
            {{ deck.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="status-select" class="filter-label">Review Status</label>
        <select id="status-select" v-model="reviewStatusFilter" class="filter-select">
          <option value="all">All</option>
          <option value="due">Due</option>
          <option value="reviewed">Reviewed</option>
          <option value="new">New</option>
        </select>
      </div>
    </div>

    <!-- ── Results list ─────────────────────────────────────────────────── -->
    <div v-if="filteredFlashcards.length === 0" class="empty-state">
      No flashcards found
    </div>

    <ul v-else class="flashcard-list">
      <li
        v-for="card in filteredFlashcards"
        :key="card.id"
        class="flashcard-item"
      >
        <div class="flashcard-word">{{ card.word }}</div>
        <div class="flashcard-definition">{{ card.definition }}</div>
        <div class="flashcard-deck">{{ getDeckName(card.deckId) }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.flashcard-browser {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── Filter bar ─────────────────────────────────────────────────────────── */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.filter-group:first-child {
  flex: 1 1 16rem;
}

.filter-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.search-input,
.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  color: #111827;
  background-color: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  outline: none;
}

.search-input:focus,
.filter-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.search-input::placeholder {
  color: #9ca3af;
}

/* ── Empty state ────────────────────────────────────────────────────────── */
.empty-state {
  padding: 2rem 1rem;
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
  border: 1px dashed #d1d5db;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

/* ── Flashcard list ─────────────────────────────────────────────────────── */
.flashcard-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.flashcard-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
}

.flashcard-item:hover {
  border-color: #bfdbfe;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.flashcard-word {
  font-weight: 600;
  font-size: 1rem;
  color: #111827;
}

.flashcard-definition {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.4;
}

.flashcard-deck {
  font-size: 0.78rem;
  color: #6b7280;
  font-style: italic;
  margin-top: 0.25rem;
}
</style>
