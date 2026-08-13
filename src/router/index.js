import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/WeatherHomeView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'weather-detail',
    component: () => import('@/views/WeatherDetailView.vue'),
    props: true,
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('@/views/KoreaMapView.vue'),
  },
  {
    path: '/compare',
    name: 'compare',
    component: () => import('@/views/WeatherCompareView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/WeatherAboutView.vue'),
  },
  {
    // Catch-all Route: 정의되지 않은 모든 경로 처리
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
