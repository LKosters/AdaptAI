import { DefineComponent } from 'vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Icon: DefineComponent<{
      name: string
      class?: string
      size?: string | number
    }>
    BlockHero: DefineComponent<{
      title: string
      link?: {
        link: string
        title: string
        icon: string
      }
      logo?: boolean
      single?: string
    }>
    ClientOnly: DefineComponent
    NuxtLink: DefineComponent<{
      to: string | object
      class?: string
    }>
    NuxtImg: DefineComponent<{
      src: string
      alt?: string
      class?: string
    }>
  }
}