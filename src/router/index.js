import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import { api } from '../helpers/api'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

router.beforeEach((to) => {
  if (to.name === 'login') {
    return true
  }

  if (!localStorage.getItem('token')) {
    return { name: 'login' }
  }

  checkTokenAuthenticity()
})

const checkTokenAuthenticity = () => {
  api()
    .get('/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.error(error)
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    })
}

export default router
