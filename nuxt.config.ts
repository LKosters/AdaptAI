import { defineNuxtConfig } from 'nuxt/config'
import type { NuxtConfig } from '@nuxt/schema'
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/icon",
    "@clerk/nuxt",
    "@pinia/nuxt",
  ],
  icon: {
    serverBundle: {
      collections: ["line-md"],
    },
  },
  plugins: [{ src: "~/plugins/firebase.client.js", mode: "client" }],
  runtimeConfig: {
    hevyAPIEndpoint: process.env.HEVY_API_ENDPOINT,
    openaiApiKey: process.env.OPENAI_API_KEY
  },
  typescript: {
    strict: true,
    typeCheck: true,
    shim: false
  },
  tailwindcss: {
    configPath: '~/tailwind.config.ts',
    exposeConfig: true,
    viewer: true
  }
} satisfies NuxtConfig)
