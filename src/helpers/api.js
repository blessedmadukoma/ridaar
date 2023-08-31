import axios from 'axios'
import { useAuthStore } from '../stores/auth.store'

const api = () => {
  const authStore = useAuthStore()

  let options = {
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {}
  }

  const userToken = authStore.getUserDataToken()

  if (userToken) {
    options.headers.Authorization = `Bearer ${userToken}`
  }
  return axios.create(options)
}

export { api }
