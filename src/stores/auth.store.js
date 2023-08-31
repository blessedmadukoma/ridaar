// import { ref } from 'vue'
import { defineStore } from 'pinia'
import { VueCookieNext } from 'vue-cookie-next'

// using ref
// export const useAuthStore = defineStore('user', () => {
//   const userDataToken = ref(null)

//   // Action to set user data token
//   const setUserDataToken = (token) => {
//     userDataToken.value = token
//   }

//   // Action to clear user data token
//   const clearUserDataToken = () => {
//     userDataToken.value = null
//   }

//   return { userDataToken, setUserDataToken, clearUserDataToken }
// })

// Using Vue-cookie
export const useAuthStore = defineStore('user', () => {
  VueCookieNext.config({ expire: '1d' }) // Set cookie expiration time

  const getUserDataToken = () => {
    return VueCookieNext.getCookie('userDataToken')
  }

  const setUserDataToken = (token) => {
    VueCookieNext.setCookie('userDataToken', token)
  }

  const clearUserDataToken = () => {
    VueCookieNext.removeCookie('userDataToken')
  }

  return { getUserDataToken, setUserDataToken, clearUserDataToken }
})

// using sessionStorage
// export const useAuthStore = defineStore('user', () => {
//   const userDataToken = ref(sessionStorage.getItem('userDataToken') || null)

//   // Action to set user data token
//   const setUserDataToken = (token) => {
//     userDataToken.value = token
//     sessionStorage.setItem('userDataToken', token)
//   }

//   // Action to clear user data token
//   const clearUserDataToken = () => {
//     userDataToken.value = null
//     sessionStorage.removeItem('userDataToken')
//   }

//   return { userDataToken, setUserDataToken, clearUserDataToken }
// })

// using localStorage
// export const useAuthStore = defineStore('user', () => {
//   const userDataToken = ref(localStorage.getItem('userDataToken') || null)
//   userDataToken
//   const setUserToken = (token) => {
//     userDataToken.value = token
//     localStorage.setItem('userDataToken', token) // Store in localStorage
//   }

//   const clearUserDataToken = () => {
//     userDataToken.value = null
//     localStorage.removeItem('userDataToken')
//   }

//   return { userToken, setUserToken }
// })
