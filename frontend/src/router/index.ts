import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import CartPage from '@/pages/CartPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegistrationPage from '@/pages/RegistrationPage.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Startpage',
      redirect: {
        name: 'Cart'
      }
    },
    {
      path: '/home',
      name: 'Home',
      children: [
        {
          path: '',
          redirect: {
            name: 'Cart'
          }
        },
        {
          path: 'cart',
          name: 'Cart',
          component: CartPage
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'Registration',
      component: RegistrationPage
    }
  ]
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { isAuthenticated } = storeToRefs(authStore)
  if (['Cart'].includes(to.name as string) && !isAuthenticated.value) {
    next({ name: 'Login' })
  } else if (['Login', 'Registration'].includes(to.name as string) && isAuthenticated.value) {
    next({ name: 'Cart' })
  } else next()
})
export default router
