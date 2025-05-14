import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Register from '@/views/Register.vue'
import Tracks from '@/views/Tracks.vue'
import CreateTrack from '@/views/CreateTrack.vue'
import Discover from '@/views/Discover.vue'
import Profile from '@/views/Profile.vue'
import ProfileTracks from '@/views/ProfileTracks.vue'
import ProfileSaved from '@/views/ProfileSaved.vue'
import ProfileEdit from '@/views/ProfileEdit.vue'
import PublicProfile from '../views/PublicProfile.vue'

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
        path: '/discover',
        name: 'Discover',
        component: Discover,
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
    },
    {
        path: '/profile/:id',
        name: 'PublicProfile',
        component: PublicProfile,
    },
    {
        path: '/profile/edit',
        name: 'ProfileEdit',
        component: ProfileEdit,
    },
    
    {
        path: '/profile/tracks',
        name: 'ProfileTracks',
        component: ProfileTracks,
    },
    {
        path: '/profile/tracks/create',
        name: 'CreateTrack',
        component: CreateTrack,
    },
    {
        path: '/profile/saved',
        name: 'ProfileSaved',
        component: ProfileSaved,
    },



]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
