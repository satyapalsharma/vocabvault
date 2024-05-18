<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useReviewStore } from '@/stores/review'
import CardReview from '@/components/CardReview.vue'
import { useRouter } from 'vue-router'

const reviewStore = useReviewStore()
const router = useRouter()

onMounted(() => {
  reviewStore.startSession()
})

const sessionComplete = computed(() => reviewStore.isSessionComplete)

function handleQuality(quality: number) {
  reviewStore.reviewCurrentCard(quality as 0 | 1 | 2 | 3 | 4 | 5)
}

function exitSession() {
  reviewStore.endSession()
  router.push('/')
}
</script>

<template>
  <div class="review-view">
    <div v-if="!reviewStore.isActive && !sessionComplete" class="loading">
      Loading review session...
    </div>

    <div v-else-if="sessionComplete" class="session-complete">
      <h2>Session Complete!</h2>
      <p v-if="reviewStore.stats">
        You reviewed {{ reviewStore.stats.reviewedCards }} cards
        ({{ reviewStore.stats.correctCards }} correct,
        {{ reviewStore.stats.incorrectCards }} incorrect)
      </p>
      <button @click="exitSession" class="btn-primary">Back to Dashboard</button>
    </div>

    <CardReview
      v-else
      :card="reviewStore.currentCard"
      :progress="reviewStore.progress"
      @quality="handleQuality"
      @exit="exitSession"
    />
  </div>
</template>

<style scoped>
.review-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.loading {
  text-align: center;
  padding: 4rem 1rem;
  color: #666;
}
.session-complete {
  text-align: center;
  padding: 4rem 1rem;
}
.session-complete h2 {
  color: #42b883;
  margin-bottom: 1rem;
}
.btn-primary {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}
.btn-primary:hover {
  background: #33a06f;
}
</style>
