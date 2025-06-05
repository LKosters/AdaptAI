import type { NuxtConfig } from '@nuxt/schema'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    runtimeConfig: {
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
    modules?: string[]
    plugins?: Array<string | { src: string; mode: string }>
    css?: string[]
    build?: {
      transpile?: string[]
    }
  }
}

declare module 'nuxt/config' {
  export function defineNuxtConfig(config: Partial<NuxtConfig>): NuxtConfig
}