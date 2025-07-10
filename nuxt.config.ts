import type { NuxtConfig } from '@nuxt/types';
import locales from './locales';
import sites from './data/sites.json';
import { Data } from './types';

const nuxtConfig: NuxtConfig = {
  generate: {
    fallback: '404.html',
  },

  router: {
    trailingSlash: true,
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
  components: false,

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
    // https://sitemap.nuxtjs.org/
    '@nuxtjs/sitemap',
    // https://github.com/nuxt-community/google-gtag-module
    '@nuxtjs/google-gtag',
    // https://sentry.nuxtjs.org/
    '@nuxtjs/sentry',
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

  sitemap: {
    hostname: process.env.SITE_URL,
    path: '/sitemap.xml',
    sitemaps: sites.filter((site) => !site.isHidden).map((site) => ({
      path: `/sitemap-${site.gameCode}.xml`,
      async routes() {
        const response = await fetch(`${site.dataSourceUrl}/data.json`);
        const data = await response.json() as Data;

        return [
          `/${site.gameCode}/`,
          `/${site.gameCode}/timeline/`,
          `/${site.gameCode}/gallery/`,
          `/${site.gameCode}/songs/`,
          `/${site.gameCode}/about/`,
          ...data.songs.map((song) => `/${site.gameCode}/song/?id=${encodeURIComponent(song.songId!)}`),
        ];
      },
    })),
  },

  'google-gtag': {
    id: process.env.GTAG_TRACK_ID,
    debug: process.env.NODE_ENV === 'development',
  },

  sentry: {
    dsn: process.env.SENTRY_DSN,

    // Additional Module Options go here
    // https://sentry.nuxtjs.org/sentry/options

    config: {
      // Add native Sentry config here
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    },
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
    treeShake: true,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'vuetify/src/locale',
      'vue-echarts',
      'echarts',
      'zrender',
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
