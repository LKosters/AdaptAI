declare module '#app' {
  export * from '@nuxt/schema'
  export * from 'nuxt/app'
  export * from 'vue'
  export * from 'h3'
  export * from '@nuxtjs/tailwindcss'
  export * from 'firebase/ai'
  export * from 'firebase/app'

  export interface NuxtApp {
    $firebaseApp: import('firebase/app').FirebaseApp
  }

  export function useNuxtApp(): NuxtApp
  export function defineNuxtPlugin(plugin: (nuxtApp: NuxtApp) => void): void
  export function useRuntimeConfig(): RuntimeConfig
}

declare module '#imports' {
  export * from '#app'
}

declare module '#build' {
  export * from '#app'
}

interface RuntimeConfig {
  public: {
    firebaseConfig: {
      apiKey: string
      authDomain: string
      projectId: string
      storageBucket: string
      messagingSenderId: string
      appId: string
      measurementId: string
    }
  }
  hevyAPIEndpoint: string
  openaiApiKey: string
}