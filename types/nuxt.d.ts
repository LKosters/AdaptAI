import type { H3Event } from 'h3'

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

declare module 'h3' {
  export function defineEventHandler<T>(handler: (event: H3Event) => Promise<T> | T): any
  export function readBody<T>(event: H3Event): Promise<T>
  export function createError(opts: { statusCode: number; message: string }): Error
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