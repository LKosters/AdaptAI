declare module '@nuxt/schema' {
  interface RuntimeConfig {
    hevyAPIEndpoint: string
  }
  interface PublicRuntimeConfig {
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
}