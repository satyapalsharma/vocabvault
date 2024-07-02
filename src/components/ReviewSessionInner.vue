<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Flashcard } from '@/composables/useReviewSession'
import { useReviewSession } from '@/composables/useReviewSession'

// ── Props ─────────────────────────────────────────────────────────────────────
const props = defineProps<{
  flashcards: Flashcard[]
}>()

// ── Emits ─────────────────────────────────────────────────────────────────────
defineEmits<{
  (e: 'sessionComplete'): void
  (e: 'restart'): void
}>()

// ── Session ───────────────────────────────────────────────────────────────────
const { currentCard, isFlipped, hasNext, nextCard, flipCard } =
  useReviewSession(props.flashcards)

// ── Derived: is the session finished? ─────────────────────────────────────────
/**
 * A session is complete when:
 *  • There is no next card (we are on the last card), AND
 *  • That last card has been flipped at least once.
 */
const isSessionComplete = computed(() => {
  if (!currentCard.value) return false
  return !hasNext.value && isFlipped.value
})

// ── Watcher: emit when the session finishes ───────────────────────────────────
watch(isSessionComplete, (done) => {
  if (done) {
    // Use nextTick so the completion UI can render first if desired,
    // but emit immediately so parent listeners fire without delay.
    emit('sessionComplete')
  }
})
</script>

<template>
  <div class="review-mode">
    <!-- ── Active card session ─────────────────────────────────────────────── -->
    <template v-if="!isSessionComplete">
      <!-- 3-D flip scene -->
      <div class="review-mode__scene">
        <div
          class="review-mode__card"
          :class="{ 'review-mode__card--flipped': isFlipped }"
          @click="flipCard"
          role="button"
          :aria-expanded="isFlipped"
          tabindex="0"
          @keydown.enter="flipCard"
          @keydown.space.prevent="flipCard"
        >
          <!-- Front face -->
          <div class="review-mode__face review-mode__face--front">
            <div class="review-mode__term">
              {{ currentCard?.term ?? '—' }}
            </div>
            <div
              v-if="currentCard?.pronunciation"
              class="review-mode__pronunciation"
            >
              {{ currentCard.pronunciation }}
            </div>
            <div
              v-if="currentCard?.tags?.length"
              class="review-mode__tags"
            >
              <span
                v-for="tag in currentCard.tags"
                :key="tag"
                class="review-mode__tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Back face -->
          <div class="review-mode__face review-mode__face--back">
            <div class="review-mode__definition">
              {{ currentCard?.definition ?? '—' }}
            </div>
            <div v-if="currentCard?.example" class="review-mode__example">
              <span class="review-mode__example-label">Example:</span>
              {{ currentCard.example }}
            </div>
          </div>
        </div>
      </div>

      <!-- ── Controls ─────────────────────────────────────────────────────── -->
      <div class="review-mode__controls">
        <!-- Flip button — visible only before the card is flipped -->
        <button
          v-if="!isFlipped"
          class="review-mode__btn review-mode__btn--flip"
          @click="flipCard"
        >
          Flip Card
        </button>

        <!-- Next button — visible only after the card is flipped -->
        <template v-else>
          <button
            class="review-mode__btn review-mode__btn--next"
            :disabled="!hasNext"
            @click="nextCard"
          >
            Next
            <span v-if="!hasNext" class="review-mode__btn-hint">(last card)</span>
          </button>
        </template>

        <div class="review-mode__progress">
          Card {{ currentIndex + 1 }} of {{ props.flashcards.length }}
        </div>
      </div>
    </template>

    <!-- ── Session complete ────────────────────────────────────────────────── -->
    <template v-else>
      <div class="review-mode review-mode__completion">
        <div class="review-mode__completion-icon" aria-hidden="true">🎉</div>
        <h2 class="review-mode__completion-title">Session Complete!</h2>
        <p class="review-mode__completion-text">
          You reviewed all {{ props.flashcards.length }} card{{
            props.flashcards.length === 1 ? '' : 's'
          }}.
        </p>
        <button
          class="review-mode__btn review-mode__btn--restart"
          @click="$emit('restart')"
        >
          Restart
        </button>
      </div>
    </template>
  </div>
</template>

<!-- ── Scoped styles ─────────────────────────────────────────────────────────── -->
<style scoped>
/* ── Layout ────────────────────────────────────────────────────────────────── */
.review-mode {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 36rem;
  margin: 0 auto;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

/* ── 3-D flip scene ────────────────────────────────────────────────────────── */
.review-mode__scene {
  perspective: 1000px;
  width: 100%;
  max-width: 28rem;
  aspect-ratio: 3 / 4;
}

.review-mode__card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.review-mode__card--flipped {
  transform: rotateY(180deg);
}

/* ── Card faces ────────────────────────────────────────────────────────────── */
.review-mode__face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-radius: 1rem;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  text-align: center;
  overflow-y: auto;
}

.review-mode__face--front {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
}

.review-mode__face--back {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: #1e293b;
  transform: rotateY(180deg);
}

/* ── Front content ─────────────────────────────────────────────────────────── */
.review-mode__term {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 0.5rem;
}

.review-mode__pronunciation {
  font-size: 1rem;
  opacity: 0.85;
  margin-bottom: 0.75rem;
  font-style: italic;
}

.review-mode__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: center;
  margin-top: 0.5rem;
}

.review-mode__tag {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(255, 255, 255, 0.25);
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
}

/* ── Back content ──────────────────────────────────────────────────────────── */
.review-mode__definition {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.review-mode__example {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #475569;
  border-left: 3px solid #6366f1;
  padding-left: 0.75rem;
  text-align: left;
  width: 100%;
  max-width: 20rem;
}

.review-mode__example-label {
  font-weight: 700;
  color: #6366f1;
  display: block;
  margin-bottom: 0.25rem;
}

/* ── Controls ──────────────────────────────────────────────────────────────── */
.review-mode__controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.review-mode__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.7rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s, transform 0.15s;
  color: #fff;
}

.review-mode__btn:active {
  transform: scale(0.97);
}

.review-mode__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.review-mode__btn--flip {
  background-color: #6366f1;
}

.review-mode__btn--flip:hover:not(:disabled) {
  background-color: #4f46e5;
}

.review-mode__btn--next {
  background-color: #10b981;
}

.review-mode__btn--next:hover:not(:disabled) {
  background-color: #059669;
}

.review-mode__btn-hint {
  font-size: 0.8rem;
  opacity: 0.75;
}

.review-mode__progress {
  font-size: 0.85rem;
  color: #64748b;
}

/* ── Completion screen ─────────────────────────────────────────────────────── */
.review-mode__completion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
}

.review-mode__completion-icon {
  font-size: 3rem;
  line-height: 1;
}

.review-mode__completion-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.review-mode__completion-text {
  font-size: 1rem;
  color: #475569;
  margin: 0;
}

.review-mode__btn--restart {
  margin-top: 0.5rem;
  background-color: #6366f1;
}

.review-mode__btn--restart:hover:not(:disabled) {
  background-color: #4f46e5;
}
</style>
