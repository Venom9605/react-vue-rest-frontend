import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/HomePage.vue';
import GamePage from '@/components/GamePage.vue';

const routes = [
    {
        path: '/', 
        name: 'Home', 
        component: HomePage
    },
    {
        path: '/game/:username?', 
        name: 'Game', 
        component: GamePage,
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router;