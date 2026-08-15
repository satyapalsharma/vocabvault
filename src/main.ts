import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { router } from './router'

// ── Global Error Handlers ────────────────────────────────────────────────────

/**
 * Handles uncaught exceptions (synchronous errors that bubble up to the
 * global scope). Logs the error details so they are visible in the console
 * and can be forwarded to an external logging service if one is configured.
 */
window.addEventListener('error', (event: ErrorEvent) => {
  console.error('[GlobalErrorHandler] Uncaught error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
  })
})

/**
 * Handles unhandled promise rejections (async errors that are not caught by
 * any `.catch()` handler). Logs the rejection reason so it can be investigated.
 */
window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  console.error('[GlobalErrorHandler] Unhandled promise rejection:', {
    reason: event.reason,
    promise: event.promise,
  })
})

// ── App Bootstrap ─────────────────────────────────────────────────────────────

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
