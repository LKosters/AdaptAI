declare module '#app' {
  interface NuxtApp {
    $firebaseApp: import('firebase/app').FirebaseApp
  }

  export function useNuxtApp(): NuxtApp
  export function defineNuxtPlugin(plugin: (nuxtApp: NuxtApp) => void): void
  export function useRuntimeConfig(): RuntimeConfig
}

declare module 'nuxt/app' {
  interface NuxtApp {
    $firebaseApp: import('firebase/app').FirebaseApp
  }

  export function useNuxtApp(): NuxtApp
  export function defineNuxtPlugin(plugin: (nuxtApp: NuxtApp) => void): void
  export function useRuntimeConfig(): RuntimeConfig
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
}