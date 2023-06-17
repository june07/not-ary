// Composables
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/NHome.vue')
    },
    {
        path: '/:catchAll(.*)',
        name: 'catchall',
        component: () => import('@/views/NHome.vue')
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
