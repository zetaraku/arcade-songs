<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { ref, computed, watch, useMeta as useHead, useContext } from '@nuxtjs/composition-api';
import { useDataStore } from '~/stores/data';
import useGameInfo from '~/composables/useGameInfo';
import useDarkMode from '~/composables/useDarkMode';
import LoadingOverlay from '~/components/LoadingOverlay.vue';
import LocaleSwitcher from '~/components/LocaleSwitcher.vue';
import SheetDialog from '~/components/dialogs/SheetDialog.vue';
import SheetComboDialog from '~/components/dialogs/SheetComboDialog.vue';
import LoadingStatus from '~/enums/LoadingStatus';
import sites from '~/data/sites.json';
import { PageNotFoundError } from '~/utils';

const context = useContext();
const dataStore = useDataStore();
const { isDarkMode } = useDarkMode();
const {
  gameCode,
  gameTitle,
  themeColor,
  accessCounterUrl,
} = useGameInfo();

const menu = computed(() => [
  {
    icon: 'mdi-apps',
    title: context.i18n.t('page-title.home'),
    to: { name: 'gameCode' },
  },
  {
    icon: 'mdi-script-text',
    title: context.i18n.t('page-title.gallery'),
    to: { name: 'gameCode-gallery' },
  },
  {
    icon: 'mdi-database',
    title: context.i18n.t('page-title.songs'),
    to: { name: 'gameCode-songs' },
  },
  {
    icon: 'mdi-comment-question',
    title: context.i18n.t('page-title.bug-report'),
    href: context.$config.siteReportUrl,
  },
  {
    icon: 'mdi-github',
    title: context.i18n.t('page-title.source-code'),
    href: context.$config.sourceCodeUrl,
  },
  {
    icon: 'mdi-information-outline',
    title: context.i18n.t('page-title.about'),
    to: { name: 'gameCode-about' },
  },
]);

useHead(() => {
  const {
    siteTitle,
    siteUrl,
    siteDescriptionEn,
    siteDescriptionJp,
  } = context.$config;

  const subSiteTitle = gameTitle.value != null ? `${gameTitle.value} | ${siteTitle}` : siteTitle;
  const pageUrl = new URL(`${gameCode.value ?? ''}/`, siteUrl).toString();
  const logoUrl = new URL('logo.png?v=1', siteUrl).toString();
  const descriptionEn = String(siteDescriptionEn).replace('______', gameTitle.value ?? 'arcade games');
  const descriptionJp = String(siteDescriptionJp).replace('______', gameTitle.value ?? '音ゲー');

  return {
    title: 'N/A',
    titleTemplate: `%s | ${subSiteTitle}`,
    meta: [
      { charset: 'utf-8', hid: 'charset' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { name: 'format-detection', content: 'telephone=no' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: subSiteTitle },
      { property: 'og:site_name', content: subSiteTitle },
      { property: 'og:url', content: pageUrl },
      { property: 'og:image', content: logoUrl },
      { property: 'og:description', content: descriptionEn },
      { name: 'description', content: descriptionEn },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: subSiteTitle },
      { name: 'twitter:image', content: logoUrl },
      { name: 'twitter:description', content: descriptionJp },
      { name: 'theme-color', content: themeColor.value },
      { name: 'msapplication-TileColor', content: themeColor.value },
      { name: 'apple-mobile-web-app-title', content: subSiteTitle },
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
  };
});

const isDrawerOpened = ref(false);
const isPortalOpened = ref(false);

function adaptSiteStyle() {
  context.$vuetify.theme.themes.light.primary = themeColor.value;
  context.$vuetify.theme.themes.dark.primary = '#FFAC1C';
}

watch(gameCode, () => {
  adaptSiteStyle();

  if (gameCode.value === undefined) {
    context.error(new PageNotFoundError());
    return;
  }

  dataStore.gameCode = gameCode.value;
}, {
  immediate: true,
});
watch(isDarkMode, () => {
  context.$vuetify.theme.dark = isDarkMode.value;
});
</script>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'DefaultLayout',
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true });
  },
});
</script>

<template>
  <v-app>
    <LoadingOverlay v-if="dataStore.currentLoadingStatus === LoadingStatus.LOADING" />

    <v-navigation-drawer
      v-if="gameCode != null"
      v-model="isDrawerOpened"
      width="300"
      class="overflow-y-auto"
      temporary
      app
    >
      <template #prepend>
        <v-list-group
          v-model="isPortalOpened"
        >
          <template #activator>
            <v-icon large left :color="themeColor">
              mdi-music-box-multiple
            </v-icon>
            <v-list-item-content>
              <v-list-item-title class="text-h6 font-weight-medium">
                {{ $config.siteTitle }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ gameTitle }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="(site, i) in sites.filter((e) => !e.isHidden || isDarkMode)"
            :key="i"
            :to="{
              name: $route.name === 'index' ? 'gameCode' : undefined,
              params: { gameCode: site.gameCode },
            }"
            @click="isPortalOpened = false;"
          >
            <v-list-item-icon>
              <v-icon :color="site.themeColor">
                mdi-music-box-multiple
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ site.gameTitle }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-divider />
      </template>

      <v-list v-if="gameCode != null">
        <v-list-item
          v-for="(menuItem, i) in menu"
          :key="i"
          :to="menuItem.to"
          :href="menuItem.href"
          :target="menuItem.href !== undefined ? '_blank' : undefined"
          exact
        >
          <v-list-item-icon>
            <v-icon>
              {{ menuItem.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ menuItem.title }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon v-if="menuItem.href !== undefined">
            <v-icon>
              mdi-open-in-new
            </v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :color="themeColor"
      dark
      app
    >
      <v-app-bar-nav-icon
        :disabled="gameCode == null"
        @click="isDrawerOpened = !isDrawerOpened;"
      />
      <NuxtLink
        class="d-flex text-decoration-none"
        style="color: inherit; user-select: none;"
        to="/"
      >
        <v-icon large left right>
          mdi-music-box-multiple
        </v-icon>
        <v-toolbar-title>
          <v-list-item-content>
            <v-list-item-title
              class="font-weight-medium mb-0"
              :class="$vuetify.breakpoint.smAndUp ? 'text-h5' : 'text-h6'"
              style="line-height: 1.8rem;"
            >
              {{ $config.siteTitle }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ gameTitle ?? 'made by @zetaraku' }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-toolbar-title>
      </NuxtLink>

      <v-spacer />

      <v-divider vertical inset class="mx-1" />
      <LocaleSwitcher />
    </v-app-bar>

    <v-main>
      <Nuxt />
    </v-main>

    <v-footer
      absolute
      app
    >
      <v-spacer />
      <a
        v-if="accessCounterUrl != null"
        href="https://www.free-counter.jp/"
        class="mr-2"
      >
        <img :src="accessCounterUrl" alt="アクセスカウンター" width="70" height="12">
      </a>
      <span>
        &copy; {{ new Date().getFullYear() }} / made by @zetaraku with &lt;3
      </span>
    </v-footer>

    <SheetDialog />
    <SheetComboDialog />
  </v-app>
</template>
