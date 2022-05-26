<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { ref, computed, watch, provide, useRoute, useMeta as useHead, nextTick } from '@nuxtjs/composition-api';
import useDataStore from '~/stores/data';
import useVM from '~/composables/useVM';
import useGameInfo from '~/composables/useGameInfo';
import LoadingStatus from '~/enums/LoadingStatus';
import sites from '~/assets/sites';
import { PageNotFoundError } from '~/utils';

const vm = useVM();
const route = useRoute();
const siteTitle = vm.$config.siteTitle!;
const dataStore = useDataStore();
const {
  gameCode,
  gameTitle,
  siteColor,
  accessCounterUrl,
} = useGameInfo();

const menu = computed(() => [
  {
    icon: 'mdi-apps',
    title: vm.$t('page-title.home'),
    to: `/${gameCode.value}/`,
  },
  {
    icon: 'mdi-script-text',
    title: vm.$t('page-title.lists'),
    to: `/${gameCode.value}/lists/`,
    disabled: true,
  },
  {
    icon: 'mdi-information-outline',
    title: vm.$t('page-title.about'),
    to: `/${gameCode.value}/about/`,
  },
  {
    icon: 'mdi-comment-question',
    title: vm.$t('page-title.bug-report'),
    href: 'https://arcade-songs-report.zetaraku.dev/',
  },
]);

useHead(() => {
  const i18nHead = vm.$nuxtI18nHead({ addSeoAttributes: true });

  const subSiteTitle = gameTitle.value ? `${gameTitle.value} | ${siteTitle}` : siteTitle;
  const siteUrl = new URL(`${gameCode.value ?? ''}/`, vm.$config.siteUrl!).toString();
  const logoUrl = new URL('logo.png?v=1', vm.$config.siteUrl!).toString();
  const descriptionEn = String(vm.$config.siteDescriptionEn!).replace('______', gameTitle.value || 'arcade games');
  const descriptionJp = String(vm.$config.siteDescriptionJp!).replace('______', gameTitle.value || '音ゲー');

  return {
    titleTemplate: `%s | ${subSiteTitle}`,
    htmlAttrs: {
      ...i18nHead.htmlAttrs,
    },
    meta: [
      ...i18nHead.meta,
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: subSiteTitle },
      { property: 'og:site_name', content: subSiteTitle },
      { property: 'og:url', content: siteUrl },
      { property: 'og:image', content: logoUrl },
      { property: 'og:description', content: descriptionEn },
      { name: 'description', content: descriptionEn },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: subSiteTitle },
      { name: 'twitter:image', content: logoUrl },
      { name: 'twitter:description', content: descriptionJp },
      { name: 'theme-color', content: siteColor.value },
      { name: 'msapplication-TileColor', content: siteColor.value },
      { name: 'apple-mobile-web-app-title', content: subSiteTitle },
    ].map((e) => ({ ...e, hid: e.name ?? e.property })),
    link: [
      ...i18nHead.link,
    ],
  };
});

const isDarkMode = ref(false);
const isDrawerOpened = ref(false);
const isPortalOpened = ref(false);

function adaptSiteStyle() {
  vm.$vuetify.theme.themes.light.primary = siteColor.value;
  vm.$vuetify.theme.themes.dark.primary = '#FFAC1C';
}
function validateGameCode() {
  if (route.value.params.gameCode !== undefined && gameCode.value === undefined) {
    vm.$nuxt.error(new PageNotFoundError());
  }
}
function adjustPortalList() {
  if (gameCode.value === undefined) {
    isPortalOpened.value = true;
  }
}

watch(gameCode, async () => {
  await nextTick();
  adaptSiteStyle();
  validateGameCode();
  adjustPortalList();
  await dataStore.switchGameCode(gameCode.value!);
}, { immediate: true });
watch(isDarkMode, () => {
  vm.$vuetify.theme.dark = isDarkMode.value;
});

provide('isDarkMode', isDarkMode);
</script>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'DefaultLayout',
  head: {},
});
</script>

<template>
  <v-app>
    <LoadingOverlay v-if="dataStore.currentLoadingStatus === LoadingStatus.LOADING" />

    <v-navigation-drawer
      v-model="isDrawerOpened"
      width="300"
      temporary
      app
    >
      <template #prepend>
        <v-list-group
          v-model="isPortalOpened"
        >
          <template #activator>
            <v-icon large left :color="siteColor">
              mdi-music-box-multiple
            </v-icon>
            <v-list-item-content>
              <v-list-item-title
                class="text-h6 font-weight-medium"
                v-text="siteTitle"
              />
              <v-list-item-subtitle
                v-text="gameTitle || 'Home'"
              />
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="(site, i) in sites"
            :key="i"
            :to="`/${site.gameCode}/`"
            nuxt
            @click.stop="isPortalOpened = false;"
          >
            <v-list-item-icon>
              <v-icon :color="site.color">
                mdi-music-box-multiple
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="site.gameTitle" />
          </v-list-item>
        </v-list-group>
        <v-divider />
      </template>

      <v-list v-if="gameCode !== undefined">
        <v-list-item
          v-for="(menuItem, i) in menu"
          :key="i"
          :to="menuItem.to"
          :nuxt="menuItem.to !== undefined"
          :href="menuItem.href"
          :target="menuItem.href !== undefined ? '_blank' : undefined"
          :disabled="menuItem.disabled"
          exact
        >
          <v-list-item-icon>
            <v-icon v-text="menuItem.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="menuItem.title" />
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
      :color="siteColor"
      dark
      app
    >
      <v-app-bar-nav-icon
        @click.stop="isDrawerOpened = !isDrawerOpened;"
      />
      <NuxtLink
        class="d-flex"
        style="text-decoration: none; color: inherit; user-select: none;"
        :to="gameCode ? `/${gameCode}/` : '/'"
      >
        <v-icon large left right>
          mdi-music-box-multiple
        </v-icon>
        <v-toolbar-title>
          <v-list-item-content>
            <v-list-item-title
              class="text-h5 font-weight-medium mb-0"
              v-text="siteTitle"
            />
            <v-list-item-subtitle
              v-text="gameTitle || 'Home'"
            />
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
        &copy; {{ new Date().getFullYear() }} / made by zetaraku with &lt;3
      </span>
    </v-footer>

    <SheetDialog />
  </v-app>
</template>
