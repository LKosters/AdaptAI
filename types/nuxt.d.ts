import type { H3Event } from 'h3'
import type { NuxtConfig } from '@nuxt/schema'

declare module '#app' {
  interface NuxtApp {
    $firebaseApp: import('firebase/app').FirebaseApp
  }

  export function useNuxtApp(): NuxtApp
  export function defineNuxtPlugin(plugin: (nuxtApp: NuxtApp) => void): void
  export function useRuntimeConfig(): RuntimeConfig
  export function defineNuxtRouteMiddleware(middleware: (to: any, from: any) => any): void
  export function navigateTo(to: string | object): Promise<void>
  export function abortNavigation(err?: Error): void
}

declare module 'nuxt/app' {
  interface NuxtApp {
    $firebaseApp: import('firebase/app').FirebaseApp
  }

  export function useNuxtApp(): NuxtApp
  export function defineNuxtPlugin(plugin: (nuxtApp: NuxtApp) => void): void
  export function useRuntimeConfig(): RuntimeConfig
}

declare module 'nuxt/config' {
  export function defineNuxtConfig(config: Partial<NuxtConfig>): NuxtConfig
}

declare module 'h3' {
  export function defineEventHandler<T>(handler: (event: H3Event) => Promise<T> | T): any
  export function readBody<T>(event: H3Event): Promise<T>
  export function createError(opts: { statusCode: number; message: string }): Error
  export function setResponseStatus(event: H3Event, code: number): void
  export function sendRedirect(event: H3Event, location: string, code?: number): void
  export function getQuery(event: H3Event): Record<string, string | string[]>
  export function getCookie(event: H3Event, name: string): string | undefined
  export function setCookie(event: H3Event, name: string, value: string, opts?: any): void
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