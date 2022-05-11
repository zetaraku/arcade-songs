<script setup lang="ts">
import { ref, watch, nextTick } from '@nuxtjs/composition-api';
import useVM from '~/composables/useVM';
import useGameCode from '~/composables/useGameCode';
import useSideNav from '~/composables/useSideNav';
import useDarkMode from '~/composables/useDarkMode';
import sites from '~/assets/sites';
import { PageNotFoundError } from '~/utils';

const vm = useVM()!;
const {
  isAtRoot,
  gameCode,
  siteTitle,
  siteColor,
  accessCounterUrl,
} = useGameCode();
const { menu } = useSideNav();

useDarkMode();

const isDrawerOpened = ref(false);
const isPortalOpened = ref(false);

function adaptSiteStyle() {
  vm.$vuetify.theme.themes.light.primary = siteColor.value;
  vm.$vuetify.theme.themes.dark.primary = '#AAAAAA';
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
}, { immediate: true });
</script>

<script lang="ts">
export default {
  name: 'DefaultLayout',
};
</script>

<template>
  <v-app>
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
            <v-icon large left color="primary">
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

      <template #append>
        <template v-if="isAtRoot">
          <v-divider />
          <div class="pa-3 text-right">
            <DarkModeSwitcher />
          </div>
        </template>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      color="primary"
      dark
      app
    >
      <v-app-bar-nav-icon @click.stop="isDrawerOpened = !isDrawerOpened" />
      <v-icon large left right>
        mdi-music-box-multiple
      </v-icon>
      <v-toolbar-title class="font-weight-medium text-h5" v-text="siteTitle" />

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
  </v-app>
</template>
