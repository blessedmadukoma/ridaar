import Axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = () => {
  let options = {
    baseURL: API_URL,
    headers: {}
  }

  if (localStorage.getItem('token')) {
    options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  }

  return Axios.create(options)
}

export { api }
