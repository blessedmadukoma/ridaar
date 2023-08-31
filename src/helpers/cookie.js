import { VueCookieNext } from 'vue-cookie-next'

VueCookieNext.config({ expire: '1d' }) // Set cookie expiration time

const getUserCookie = () => {
  return VueCookieNext.getCookie('userDataToken')
}

const setUserCookie = (token) => {
  VueCookieNext.setCookie('userDataToken', token)
}

const clearUserCookie = () => {
  VueCookieNext.removeCookie('userDataToken')
}

export { getUserCookie, setUserCookie, clearUserCookie }
