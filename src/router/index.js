import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import FindRideView from '../views/FindRideView.vue'
import StandbyView from '../views/StandbyView.vue'
// import { api } from '../helpers/api'
import axios from 'axios'

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
    },
    {
      path: '/find',
      name: 'find-ride',
      component: FindRideView
    },
    {
      path: '/standby',
      name: 'standby',
      component: StandbyView
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
  axios
    .get(`${import.meta.env.VITE_API_URL}/user`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then((response) => {
      console.log(response.data)
    })
    .catch(() => {
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    })
}

export default router
