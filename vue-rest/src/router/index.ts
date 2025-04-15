import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Register from '@/views/Register.vue'
import Tracks from '@/views/Tracks.vue'
import CreateTrack from '@/views/CreateTrack.vue'
import EditTrack from '@/views/EditTrack.vue'
import DeleteTrack from '@/views/DeleteTrack.vue'

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
    {
        path: '/tracks/edit/:id',
        name: 'EditTrack',
        component: EditTrack,
    },
    {
        path: '/tracks/delete/:id',
        name: 'DeleteTrack',
        component: DeleteTrack,
    },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
