declare module '@nuxtjs/tailwindcss' {
  interface TailwindConfig {
    content?: string[]
    theme?: {
      extend?: {
        colors?: Record<string, string | Record<string, string>>
        fontFamily?: Record<string, string[]>
        spacing?: Record<string, string>
        borderRadius?: Record<string, string>
        fontSize?: Record<string, [string, { lineHeight: string }]>
        screens?: Record<string, string>
        boxShadow?: Record<string, string>
        zIndex?: Record<string, string | number>
        animation?: Record<string, string>
        keyframes?: Record<string, Record<string, Record<string, string>>>
      }
    }
    plugins?: any[]
    darkMode?: 'media' | 'class'
  }

  interface TailwindOptions {
    cssPath?: string | string[] | false
    configPath?: string
    exposeConfig?: boolean
    config?: TailwindConfig
    viewer?: boolean
  }

  interface ModuleOptions extends TailwindOptions {
    // Add any additional module options here
  }

  export function defineConfig(config: TailwindConfig): TailwindConfig
  export function withTailwindConfig<T extends Record<string, any>>(config: T): T & { tailwindcss: TailwindConfig }
}