<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Card } from '@/types'
import { useCardStore } from '@/stores/card'
import { formatDate } from '@/lib/utils'

const props = defineProps<{
  card: Card | null
  progress: number
}>()

const emit = defineEmits<{
  quality: [quality: number]
  exit: []
}>()

const cardStore = useCardStore()
const showAnswer = ref(false)

const word = computed(() => {
  if (!props.card) return null
  return cardStore.getWordById(props.card.wordId)
})

const qualities = [
  { value: 1, label: 'Again', color: '#ef4444' },
  { value: 2, label: 'Hard', color: '#f97316' },
  { value: 3, label: 'Good', color: '#42b883' },
  { value: 4, label: 'Easy', color: '#3b82f6' },
]

function revealAnswer() {
  showAnswer.value = true
}

function selectQuality(quality: number) {
  emit('quality', quality)
  showAnswer.value = false
}
</script>

<template>
  <div class="card-review">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>

    <div v-if="!card" class="empty">No card to review</div>

    <div v-else class="review-card">
      <div class="card-front">
        <div class="word-term">{{ word?.term }}</div>
        <div v-if="word?.pronunciation" class="word-pronunciation">
          {{ word.pronunciation }}
        </div>
        <div v-if="word?.example" class="word-example">
          "{{ word.example }}"
        </div>
      </div>

      <div v-if="showAnswer" class="card-back">
        <div class="word-definition">{{ word?.definition }}</div>
        <div class="word-tags">
          <span v-for="tag in word?.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="review-meta">
          Next review: {{ formatDate(new Date(card.dueDate)) }}
        </div>
      </div>

      <div class="actions">
        <button v-if="!showAnswer" @click="revealAnswer" class="btn-reveal">
          Show Answer
        </button>
        <template v-else>
          <div class="quality-buttons">
            <button
              v-for="q in qualities"
              :key="q.value"
              @click="selectQuality(q.value)"
              class="btn-quality"
              :style="{ backgroundColor: q.color }"
            >
              {{ q.label }}
            </button>
          </div>
        </template>
        <button @click="emit('exit')" class="btn-exit">Exit</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-review {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #42b883;
  transition: width 0.3s ease;
}
.review-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.card-front {
  text-align: center;
}
.word-term {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.word-pronunciation {
  color: #666;
  font-style: italic;
  margin-bottom: 0.5rem;
}
.word-example {
  color: #888;
  font-size: 0.875rem;
}
.card-back {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
  text-align: center;
}
.word-definition {
  font-size: 1.125rem;
  margin-bottom: 1rem;
}
.word-tags {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tag {
  background: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}
.review-meta {
  font-size: 0.875rem;
  color: #666;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.btn-reveal {
  padding: 0.75rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}
.quality-buttons {
  display: flex;
  gap: 0.5rem;
}
.btn-quality {
  flex: 1;
  padding: 0.75rem;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}
.btn-exit {
  padding: 0.5rem;
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  cursor: pointer;
}
.empty {
  text-align: center;
  padding: 4rem 1rem;
  color: #666;
}
</style>
