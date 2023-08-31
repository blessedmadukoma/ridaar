import { ref } from 'vue'
import { defineStore } from 'pinia'

// use this if managing the state becomes complex
export const useAuthStore = defineStore('user', () => {
  // Reactive state properties
  const userDataToken = ref(sessionStorage.getItem('userDataToken') || null)

  // Action to set user data token
  const setUserDataToken = (token) => {
    userDataToken.value = token
    sessionStorage.setItem('userDataToken', token)
  }

  // Action to clear user data token
  const clearUserDataToken = () => {
    userDataToken.value = null
    sessionStorage.removeItem('userDataToken')
  }

  return { userDataToken, setUserDataToken, clearUserDataToken }
})
