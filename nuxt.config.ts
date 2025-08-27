// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  /**runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL
    }
  },*/
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts', 
    '@nuxt/icon', 
    '@nuxt/image', 
    '@nuxt/ui',
  ],
  css: ['@/assets/css/main.css'],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error']
    }
  },
  app: {
    baseURL: "/salidas",
    head: {
      title: 'Formatos de salida de equipo audiovisual',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/perrito.svg' }
      ]
    }
  }
})