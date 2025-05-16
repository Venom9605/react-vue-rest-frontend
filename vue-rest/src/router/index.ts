import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Register from '@/views/Register.vue'
import CreateTrack from '@/views/CreateTrack.vue'
import Discover from '@/views/Discover.vue'
import Profile from '@/views/Profile.vue'
import ProfileTracks from '@/views/ProfileTracks.vue'
import ProfileSaved from '@/views/ProfileSaved.vue'
import ProfileEdit from '@/views/ProfileEdit.vue'
import PublicProfile from '../views/PublicProfile.vue'
import SearchResults from '@/views/SearchResults.vue'
import { useUserDataStore } from '@/stores/userDataStore'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { public: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { public: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { public: true }
    },
    {
        path: '/discover',
        name: 'Discover',
        component: Discover,
        meta: { public: true }
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
        meta: { public: true }
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
    {
        path: '/searchresults',
        name: 'SearchResults',
        component: SearchResults,
        meta: { public: true }
    },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach((to, from, next) => {
  const store = useUserDataStore();
  const isPublic = to.meta.public === true;

  if (!isPublic && !store.jwt) {
    next('/login');
  } else {
    next();
  }
});

export default router
