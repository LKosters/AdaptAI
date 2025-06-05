declare module '#app' {
  import type { NuxtApp } from '@nuxt/schema'
  import type { FirebaseApp } from 'firebase/app'

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

  interface NuxtAppOptions extends NuxtApp {
    $firebaseApp: FirebaseApp
  }

  export function useNuxtApp(): NuxtAppOptions
  export function defineNuxtPlugin(plugin: (nuxtApp: NuxtAppOptions) => void): void
  export function useRuntimeConfig(): RuntimeConfig
}

declare module '#imports' {
  export * from '#app'
}

declare module '#build' {
  export * from '#app'
}

declare module 'firebase/ai' {
  import type { FirebaseApp } from 'firebase/app'

  export interface Part {
    text: string
  }

  export interface Content {
    role: string
    parts: Part[]
  }

  export interface GenerationConfig {
    responseMimeType?: string
    temperature?: number
    topK?: number
    topP?: number
    maxOutputTokens?: number
    candidateCount?: number
  }

  export interface ChatSession {
    sendMessage(parts: Part[]): Promise<{
      response: {
        text: () => string
      }
    }>
  }

  export interface GenerativeModel {
    startChat(): ChatSession
  }

  export function getAI(app: FirebaseApp): any
  export function getGenerativeModel(
    ai: any,
    config: {
      model: string
      generationConfig?: GenerationConfig
      systemInstruction?: Content
    }
  ): GenerativeModel
}

declare module '@nuxtjs/tailwindcss' {
  interface TailwindConfig {
    content?: string[]
    theme?: {
      extend?: Record<string, any>
    }
    plugins?: any[]
  }

  export function defineConfig(config: TailwindConfig): TailwindConfig
}