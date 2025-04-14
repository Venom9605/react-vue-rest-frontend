import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Register from '@/views/Register.vue'
import Tracks from '@/views/Tracks.vue'
import CreateTrack from '@/views/CreateTrack.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/tracks',
        name: 'Tracks',
        component: Tracks,
    },
    {
        path: '/tracks/create',
        name: 'CreateTrack',
        component: CreateTrack,
    },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
