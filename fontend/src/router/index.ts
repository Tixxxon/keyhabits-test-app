import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../pages/IndexPage.vue'),
    },
    {
      path: '/cars',
      name: 'cars',
      component: () => import('../pages/CarPage.vue'),
    },
    {
      path: '/shops',
      name: 'shops',
      component: () => import('../pages/ShopPage.vue'),
    },
  ],
});

export default router;
