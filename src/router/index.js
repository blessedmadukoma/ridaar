import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import FindRideView from '../views/FindRideView.vue'
import StandbyView from '../views/StandbyView.vue'
import DriverInfoView from '../views/DriverInfoView.vue'
import MapView from '../views/MapView.vue'
import TripView from '../views/TripView.vue'
import DrivingView from '../views/DrivingView.vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth.store'

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
    },
    {
      path: '/driver-info',
      name: 'driver-info',
      component: DriverInfoView
    },
    {
      path: '/map',
      name: 'map',
      component: MapView
    },
    {
      path: '/trip',
      name: 'trip',
      component: TripView
    },
    {
      path: '/driving',
      name: 'driving',
      component: DrivingView
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
  const authStore = useAuthStore()

  const userToken = authStore.getUserDataToken()
  if (to.name === 'login') {
    return true
  }

  // if (!localStorage.getItem('token')) {
  if (!userToken) {
    return { name: 'login' }
  }

  checkTokenAuthenticity()
})

const checkTokenAuthenticity = () => {
  const authStore = useAuthStore()
  const userToken = authStore.getUserDataToken()

  axios
    .get(`${import.meta.env.VITE_API_URL}/user`, {
      headers: {
        Authorization: 'Bearer ' + userToken
      }
    })
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
      // authStore.clearUserDataToken()
      // router.push({ name: 'login' })
    })
}

export default router
