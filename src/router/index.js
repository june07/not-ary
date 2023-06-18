// Composables
import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@auth0/auth0-vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/NHome.vue')
    },
    {
        path: '/support',
        name: 'support',
        component: () => import('@/views/NSupport.vue')
    },
    {
        path: '/account',
        name: 'account',
        component: () => import('@/views/NAccount.vue'),
        beforeEnter: authGuard
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
