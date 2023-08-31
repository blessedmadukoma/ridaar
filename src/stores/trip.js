import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useTripStore = defineStore('trip', () => {
  const id = ref(null)
  const user_id = ref(null)
  const destination_name = ref(null)

  const driver = reactive({
    id: null,
    year: null,
    make: null,
    model: null,
    license_plate: null,
    color: null,
    user: {
      name: null
    }
  })

  return { id, user_id, destination_name, driver }
})
