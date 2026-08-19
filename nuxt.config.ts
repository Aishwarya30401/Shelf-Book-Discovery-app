import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-18',
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    googleBooksApiKey: '',
  },

  // nitro: {
  //   preset: 'netlify',
  // },

  // modules: ['@nuxtjs/storybook'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['@netlify/nuxt'],
})

