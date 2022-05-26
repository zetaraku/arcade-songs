<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { ref, watch, provide, useMeta as useHead, nextTick } from '@nuxtjs/composition-api';
import useDataStore from '~/stores/data';
import useVM from '~/composables/useVM';
import useGameCode from '~/composables/useGameCode';
import useSideNav from '~/composables/useSideNav';
import LoadingStatus from '~/enums/LoadingStatus';
import sites from '~/assets/sites';
import { PageNotFoundError } from '~/utils';

const vm = useVM()!;

const dataStore = useDataStore();
const {
  isAtRoot,
  gameCode,
  gameTitle,
  siteTitle,
  siteColor,
  accessCounterUrl,
} = useGameCode();
const { menu } = useSideNav();

useHead(() => {
  const i18nHead = vm.$nuxtI18nHead({ addSeoAttributes: true });

  const siteUrl = new URL(`${gameCode.value ?? ''}/`, vm.$config.siteUrl!).toString();
  const logoUrl = new URL('logo.png', vm.$config.siteUrl!).toString();
  const descriptionEn = String(vm.$config.siteDescriptionEn!).replace('______', gameTitle.value || 'arcade games');
  const descriptionJp = String(vm.$config.siteDescriptionJp!).replace('______', gameTitle.value || '音ゲー');

  return {
    titleTemplate: `%s | ${siteTitle.value}`,
    htmlAttrs: {
      ...i18nHead.htmlAttrs,
    },
    meta: [
      ...i18nHead.meta,
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: siteTitle.value },
      { property: 'og:site_name', content: siteTitle.value },
      { property: 'og:url', content: siteUrl },
      { property: 'og:image', content: logoUrl },
      { property: 'og:description', content: descriptionEn },
      { name: 'description', content: descriptionEn },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: siteTitle.value },
      { name: 'twitter:image', content: logoUrl },
      { name: 'twitter:description', content: descriptionJp },
      { name: 'theme-color', content: siteColor.value },
      { name: 'msapplication-TileColor', content: siteColor.value },
      { name: 'apple-mobile-web-app-title', content: siteTitle.value },
    ].map((e) => ({ ...e, hid: e.hid ?? e.name ?? e.property })),
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
  if (gameCode.value === undefined && !isAtRoot.value) {
    throw new PageNotFoundError();
  }
}
function adjustPortalList() {
  if (isAtRoot.value) {
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
              <v-list-item-title class="text-h6">
                {{ siteTitle }}
              </v-list-item-title>
              <v-list-item-subtitle>
                made by @zetaraku
              </v-list-item-subtitle>
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
            <v-list-item-title v-text="site.title" />
          </v-list-item>
        </v-list-group>
        <v-divider />
      </template>

      <v-list>
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
        <v-toolbar-title
          class="font-weight-medium"
          :class="$vuetify.breakpoint.xsOnly ? 'text-h6' : 'text-h4'"
          v-text="siteTitle"
        />
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
