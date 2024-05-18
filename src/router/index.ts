import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import ReviewView from '@/views/ReviewView.vue'
import DeckView from '@/views/DeckView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/review',
      name: 'review',
      component: ReviewView,
    },
    {
      path: '/deck/:id',
      name: 'deck',
      component: DeckView,
      props: true,
    },
  ],
})
