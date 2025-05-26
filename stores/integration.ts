import { defineStore } from 'pinia'
import { collection, query, where, getDocs } from "firebase/firestore"

export const useIntegrationStore = defineStore('integration', () => {
  const hevyApiKey = ref<string>('')
  const isLoading = ref(false)
  const error = ref<string>('')

  const fetchHevyApiKey = async (userId: string) => {
    if (!userId) return

    isLoading.value = true
    error.value = ''

    try {
      const nuxtApp = useNuxtApp()
      const firebase = nuxtApp.$firebase as any
      
      const q = query(
        collection(firebase.db, "Integration"),
        where("userId", "==", userId)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        hevyApiKey.value = data.hevyApiKey || ''
      } else {
        hevyApiKey.value = ''
      }
    } catch (err) {
      console.error("Error fetching Hevy API key:", err)
      error.value = 'Failed to fetch API key'
      hevyApiKey.value = ''
    } finally {
      isLoading.value = false
    }
  }

  const setHevyApiKey = (apiKey: string) => {
    hevyApiKey.value = apiKey
  }

  const clearHevyApiKey = () => {
    hevyApiKey.value = ''
    error.value = ''
  }

  return {
    hevyApiKey: readonly(hevyApiKey),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchHevyApiKey,
    setHevyApiKey,
    clearHevyApiKey
  }
}) 