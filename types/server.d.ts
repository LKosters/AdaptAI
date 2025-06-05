import type { H3Event } from 'h3'

declare module 'nitropack' {
  interface NitroApp {
    hooks: Record<string, Function[]>
  }
}

declare module '#imports' {
  export * from 'h3'
  export * from '@nuxt/schema'
  export * from 'nitropack'
}

declare module '#app' {
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

  interface RuntimeNuxtHooks {
    'app:created': (app: any) => void | Promise<void>
    'app:beforeMount': (app: any) => void | Promise<void>
    'app:mounted': (app: any) => void | Promise<void>
    'app:error': (err: any) => void | Promise<void>
    'app:error:cleared': (options: { redirect?: string }) => void | Promise<void>
    'page:start': () => void | Promise<void>
    'page:finish': () => void | Promise<void>
    'page:transition:finish': () => void | Promise<void>
  }
}

declare module 'h3' {
  interface H3EventContext {
    params: Record<string, string>
    query: Record<string, string | string[]>
    body: any
  }

  export function defineEventHandler<T = any>(handler: (event: H3Event) => Promise<T> | T): any
  export function getQuery(event: H3Event): Record<string, string | string[]>
  export function getRouterParams(event: H3Event): Record<string, string>
  export function readBody<T = any>(event: H3Event): Promise<T>
  export function setResponseStatus(event: H3Event, code: number): void
  export function sendRedirect(event: H3Event, location: string, code?: number): void
  export function createError(opts: { statusCode: number; statusMessage?: string; message: string }): Error & { statusCode: number; statusMessage?: string }
  export function getRequestHeaders(event: H3Event): Record<string, string | string[]>
  export function getRequestHeader(event: H3Event, name: string): string | undefined
  export function setResponseHeaders(event: H3Event, headers: Record<string, string | string[]>): void
  export function setResponseHeader(event: H3Event, name: string, value: string): void
}