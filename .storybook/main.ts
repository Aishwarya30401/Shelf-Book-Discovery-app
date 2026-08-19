import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/**/*.story.@(js|jsx|mjs|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],

  framework: '@storybook/vue3-vite',

  viteFinal: async (config) => {
    const { default: vue } = await import('@vitejs/plugin-vue')

    config.plugins = config.plugins || []
    config.plugins.push(vue())

    return config
  },
}

export default config