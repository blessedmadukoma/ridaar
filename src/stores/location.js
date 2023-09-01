import { defineStore } from 'pinia'
import { reactive } from 'vue'

const getUserLocation = () => {
  try {
    return new Promise((response, reject) => {
      navigator.geolocation.getCurrentPosition(response, reject)
    })
  } catch (error) {
    console.error('error getting user location', error)
  }
}

export const useLocationStore = defineStore('location', () => {
  const destination = reactive({
    name: '',
    address: '',
    geometry: {
      lat: '',
      lng: ''
    }
  })

  const current = reactive({
    geometry: {
      lat: '',
      lng: ''
    }
  })

  const updateCurrentLocation = async () => {
    const { coords } = await getUserLocation()

    current.geometry = {
      lat: coords.latitude,
      lng: coords.longitude
    }
  }

  const reset = () => {
    destination.name = ''
    destination.address = ''
    destination.geometry.lat = null
    destination.geometry.lng = null

    current.geometry.lat = null
    current.geometry.lng = null
  }

  return { destination, current, updateCurrentLocation, reset }
})
