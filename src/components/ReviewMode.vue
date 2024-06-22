<script setup lang="ts">
import { ref } from 'vue'
import type { Flashcard } from '@/composables/useReviewSession'
import ReviewSessionInner from './ReviewSessionInner.vue'

// ── Props ─────────────────────────────────────────────────────────────────────
const props = defineProps<{
  flashcards: Flashcard[]
}>()

// ── Emits ─────────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'sessionComplete'): void
}>()

// ── Reactive key ──────────────────────────────────────────────────────────────
// Bumping this value forces Vue to destroy and recreate ReviewSessionInner,
// which re-runs its <script setup> and re-initialises useReviewSession()
// with clean refs — effectively "restarting" the session with the same cards.
const sessionKey = ref(0)

function handleRestart(): void {
  sessionKey.value++
}
</script>

<template>
  <ReviewSessionInner
    :key="sessionKey"
    :flashcards="props.flashcards"
    @session-complete="emit('sessionComplete')"
    @restart="handleRestart"
  />
</template>
