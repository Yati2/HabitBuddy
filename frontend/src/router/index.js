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
      component: ProfileView,
      meta: { requiresAuth: true }
    },

    {
      path: '/journal',
      name: 'journal',
      component: JournalView,
      meta: { requiresAuth: true }
    },
    {
      path: '/forum',
      name: 'forum',
      component: ForumView,
      meta: { requiresAuth: true }
    },
    {
      path: '/pet',
      name: 'pet',
      component: PetView,
      meta: { requiresAuth: true }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView,
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage
    },
    {
      path: '/help',
      name: 'HelpPage',
      component: HelpPage,
      meta: { requiresAuth: true }
    }
  ]
})
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true'

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
