import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-18',
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    googleBooksApiKey: process.env.NUXT_GOOGLE_BOOKS_API_KEY,
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