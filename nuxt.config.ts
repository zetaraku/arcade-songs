/* eslint-disable import/no-extraneous-dependencies */
import { NuxtConfig } from '@nuxt/types';
import locales from './locales';

const nuxtConfig: NuxtConfig = {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  publicRuntimeConfig: {
    siteTitle: process.env.SITE_TITLE,
    siteUrl: process.env.SITE_URL,
    siteReportUrl: process.env.SITE_REPORT_URL,
    siteDescriptionEn: process.env.SITE_DESCRIPTION_EN,
    siteDescriptionJp: process.env.SITE_DESCRIPTION_JP,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.SITE_TITLE!,
    meta: [
      { charset: 'utf-8', hid: 'charset' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { name: 'format-detection', content: 'telephone=no' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: process.env.SITE_TITLE! },
      { property: 'og:site_name', content: process.env.SITE_TITLE! },
      { property: 'og:url', content: process.env.SITE_URL! },
      { property: 'og:image', content: new URL('logo.png?v=1', process.env.SITE_URL!).toString() },
      { property: 'og:description', content: String(process.env.SITE_DESCRIPTION_EN!).replace('______', 'arcade games') },
      { name: 'description', content: String(process.env.SITE_DESCRIPTION_EN!).replace('______', 'arcade games') },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: process.env.SITE_TITLE! },
      { name: 'twitter:image', content: new URL('logo.png?v=1', process.env.SITE_URL!).toString() },
      { name: 'twitter:description', content: String(process.env.SITE_DESCRIPTION_JP!).replace('______', '音ゲー') },
      { name: 'theme-color', content: '#424242' },
      { name: 'msapplication-TileColor', content: '#424242' },
      { name: 'apple-mobile-web-app-title', content: process.env.SITE_TITLE! },
    ].map((e) => ({ ...e, hid: e.hid ?? e.name ?? e.property })),
    link: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png?v=1', hid: 'icon-32' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png?v=1', hid: 'icon-16' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=1', hid: 'icon-ico' },
      { rel: 'manifest', href: '/site.webmanifest?v=1' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg?v=1' },
      { rel: 'shortcut-icon', href: '/favicon.ico?v=1' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png?v=1' },
    ].map((e) => ({ ...e, hid: e.hid ?? e.rel })),
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/global.scss',
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
    customVariables: ['~/assets/variables.scss'],
    optionsPath: '~/vuetify.options.ts',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vuetify/src/locale'],
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
