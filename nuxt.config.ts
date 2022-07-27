/* eslint-disable import/no-extraneous-dependencies */
import { NuxtConfig } from '@nuxt/types';
import locales from './locales';

const nuxtConfig: NuxtConfig = {
  generate: {
    fallback: '404.html',
  },

  publicRuntimeConfig: {
    siteTitle: process.env.SITE_TITLE,
    siteUrl: process.env.SITE_URL,
    siteReportUrl: process.env.SITE_REPORT_URL,
    sourceCodeUrl: process.env.SOURCE_CODE_URL,
    siteDescriptionEn: process.env.SITE_DESCRIPTION_EN,
    siteDescriptionJp: process.env.SITE_DESCRIPTION_JP,
    indexAccessCounterUrl: process.env.INDEX_ACCESS_COUNTER_URL,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/styles/global.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/i18n-vuetify.client.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://composition-api.nuxtjs.org/
    '@nuxtjs/composition-api/module',
    // https://pinia.vuejs.org/ssr/nuxt.html
    '@pinia/nuxt',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    // https://i18n.nuxtjs.org/
    '@nuxtjs/i18n',
    // https://github.com/nuxt-community/google-gtag-module
    '@nuxtjs/google-gtag',
  ],

  i18n: {
    baseUrl: process.env.SITE_URL,
    langDir: '~/locales/',
    locales,
    defaultLocale: 'en',
    strategy: 'no_prefix',
    lazy: true,
    vueI18n: {
      fallbackLocale: 'en',
    },
  },

  'google-gtag': {
    id: process.env.GTAG_TRACK_ID,
    debug: process.env.NODE_ENV === 'development',
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/styles/variables.scss'],
    optionsPath: '~/vuetify.options.ts',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'vuetify/src/locale',
      'yaml',
    ],
    extend(config) {
      config.module?.rules.push({
        test: /\.ya?ml$/,
        type: 'javascript/auto',
        use: 'yaml-loader',
      });
    },
  },
};

export default nuxtConfig;
