<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { inject, useMeta as useHead, useContext, Ref } from '@nuxtjs/composition-api';
import sites from '~/assets/sites.json';

const isDarkMode: Ref<boolean> = inject('isDarkMode')!;

const context = useContext();

useHead(() => ({
  titleTemplate: '%s',
  title: `${context.$config.siteTitle}`,
}));
</script>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'IndexPage',
  head: {},
});
</script>

<template>
  <v-container class="fill-height pa-8">
    <v-row class="align-center">
      <v-col cols="12" md="6" class="text-center">
        <v-icon :size="120" class="my-6">
          mdi-music-box-multiple
        </v-icon>
        <h1 class="mb-5">
          <span>arcade-songs</span>
        </h1>
        <p v-text="$t('page.index.description')" />
      </v-col>
      <v-col cols="12" md="6">
        <v-list
          nav
          max-width="500px"
          class="mx-auto"
        >
          <v-list-item
            v-for="(site, i) in sites.filter((e) => !e.isHidden || isDarkMode)"
            :key="i"
            :to="{ name: 'gameCode', params: { gameCode: site.gameCode }}"
          >
            <v-list-item-icon>
              <v-icon :color="site.themeColor">
                mdi-music-box-multiple
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="site.gameTitle" />
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
