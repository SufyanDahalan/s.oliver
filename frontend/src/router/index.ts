import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/Home.vue'
import CartPage from '@/pages/Cart.vue'
import AboutPage from '@/pages/About.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'startpage',
    //   children: [
    //     {
    //       // name: 'home',
    //       path: 'home',
    //       children: [
    //         {
    //           path: '',
    //           name: 'home',
    //           component: CartPage
    //         },
    //         {
    //           path: 'cart',
    //           name: 'cart',
    //           component: CartPage
    //         }
    //       ]
    //     },
    //     {
    //       path: 'about',
    //       name: 'about',
    //       // route level code-splitting
    //       // this generates a separate chunk (About.[hash].js) for this route
    //       // which is lazy-loaded when the route is visited.
    //       component: AboutPage
    //     }
    //   ]
    // }
    {
      path: '/',
      name: 'notwreaarear',
      redirect: {
        name: 'home'
      }
    },
    {
      path: '/home',
      name: 'Home',
      children: [
        {
          path: '',
          component: HomePage
        },
        {
          path: 'cart',
          name: 'Cart',
          component: CartPage
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage
    }
  ]
})

export default router
