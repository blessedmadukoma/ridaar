import axios from 'axios'
import { getUserCookie } from '../helpers/cookie'

const api = () => {
  let options = {
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {}
  }

  console.log(getUserCookie())
  // if (localStorage.getItem('token')) {
  // options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  if (getUserCookie()) {
    options.headers.Authorization = `Bearer ${getUserCookie()}`
  }
  return axios.create(options)
}

export { api }
