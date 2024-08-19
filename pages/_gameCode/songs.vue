<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { ref, computed, useMeta as useHead, useContext, ComputedRef } from '@nuxtjs/composition-api';
import { useDataStore } from '~/stores/data';
import useGameInfo from '~/composables/useGameInfo';
import useGameData from '~/composables/useGameData';
import useSheetDialog from '~/composables/useSheetDialog';
import type { DataTableHeader } from 'vuetify';

const context = useContext();
const dataStore = useDataStore();
const { gameCode } = useGameInfo();
const {
  getCategoryIndex,
  getVersionIndex,
  getTypeAbbr,
  getDifficultyColor,
} = useGameData();
const { viewSheet } = useSheetDialog();

const searchInput = ref('');

const songs = computed(() => dataStore.currentData.songs);
const headers: ComputedRef<DataTableHeader[]> = computed(() => [
  {
    text: 'No.',
    value: 'songNo',
    width: 10,
    searchable: false,
  },
  {
    text: context.i18n.t('term.category') as string,
    value: 'category',
    width: 150,
    sort: (a: string, b: string) => getCategoryIndex(a) - getCategoryIndex(b),
    searchable: false,
  },
  {
    text: context.i18n.t('term.title') as string,
    value: 'title',
    width: 250,
  },
  {
    text: context.i18n.t('term.artist') as string,
    value: 'artist',
    width: 250,
  },
  {
    text: context.i18n.t('term.sheets') as string,
    value: 'sheets',
    width: 350,
    searchable: false,
  },
  {
    text: context.i18n.t('term.bpm') as string,
    value: 'bpm',
    width: 50,
    searchable: false,
  },
  {
    text: context.i18n.t('term.version') as string,
    value: 'version',
    width: 200,
    sort: (a: string, b: string) => getVersionIndex(a) - getVersionIndex(b),
    searchable: false,
  },
]);

useHead(() => ({
  title: context.i18n.t('page-title.songs') as string,
}));
</script>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'GameSongsPage',
  head: {},
});
</script>

<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <v-container fluid class="pa-8">
    <h1>
      <span v-text="$t('page-title.songs')" />
    </h1>

    <!--
      A placeholder link for Nuxt to crawl in SSG mode.
      See: https://nuxtjs.org/docs/configuration-glossary/configuration-generate#routes
    -->
    <router-link v-show="false" :to="{ name: 'gameCode-song' }" />

    <v-data-table
      :headers="headers"
      :items="songs"
      :search="searchInput"
      must-sort
    >
      <template #top>
        <v-text-field
          v-model="searchInput"
          :label="$t('ui.search')"
          prepend-icon="mdi-magnify"
          clearable
        />
      </template>

      <template #item.category="{ item: song }">
        <span>{{ (song.category ?? '').replaceAll('|', '｜') }}</span>
      </template>
      <template #item.title="{ item: song }">
        <router-link :to="{ name: 'gameCode-song', query: { id: song.songId } }">
          {{ song.title }}
        </router-link>
      </template>
      <template #item.sheets="{ item: song }">
        <v-btn
          v-for="(sheet, i) in song.sheets"
          :key="i"
          text
          rounded
          class="font-weight-bold text-none"
          :style="{ 'color': getDifficultyColor(sheet.difficulty) }"
          @click="
            viewSheet(sheet);
            $gtag('event', 'SheetViewed', { gameCode, eventSource: 'GameSongsPage' });
          "
        >
          <sub v-text="getTypeAbbr(sheet.type)" />
          <span v-text="sheet.level" />
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>
