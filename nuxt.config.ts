// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // CSS Framework
  css: ['~/assets/css/main.css'],
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/apollo',
    '@vueuse/nuxt'
  ],
  
  // Apollo GraphQL Configuration
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
        wsEndpoint: process.env.GRAPHQL_WS_ENDPOINT || 'ws://localhost:3000/graphql',
      }
    }
  },
  
  // Runtime Config
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000/api',
      graphqlEndpoint: process.env.GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
    }
  },
  
  // App Configuration
  app: {
    head: {
      title: 'Automation Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Advanced workflow automation platform with dynamic modules' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // Server-side rendering
  ssr: true,
  
  // Build configuration
  build: {
    transpile: ['@apollo/client', 'graphql']
  },
  
  // Tailwind CSS
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  }
})

