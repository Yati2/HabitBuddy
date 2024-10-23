import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import JournalView from '../views/JournalView.vue'
import ForumView from '../views/ForumView.vue'
import PetView from '../views/PetView.vue'
import TasksView from '../views/TasksView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LandingPage from '../views/LandingPage.vue'
import ProfileView from '@/views/ProfileView.vue'
import HelpPage from '../views/HelpPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },

    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: DashboardView
    },
    {
      path: '/journal',
      name: 'journal',
      component: JournalView
    },
    {
      path: '/forum',
      name: 'forum',
      component: ForumView
    },
    {
      path: '/pet',
      name: 'pet',
      component: PetView
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage,
    },
    {
      path: '/help',
      name: 'HelpPage',
      component: HelpPage,
    }
  ]
})

export default router
