<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { computed, useRoute, useMeta as useHead, useContext } from '@nuxtjs/composition-api';
import useDataStore from '~/stores/data';
import useGameInfo from '~/composables/useGameInfo';
import useGameData from '~/composables/useGameData';
import useSheetDialog from '~/composables/useSheetDialog';
import LoadingStatus from '~/enums/LoadingStatus';
import { validateNoteCounts, PageNotFoundError } from '~/utils';

const context = useContext();
const route = useRoute();
const dataStore = useDataStore();
const {
  gameCode,
} = useGameInfo();
const {
  getTypeAbbr,
  getDifficultyColor,
  getDifficultyName,
} = useGameData();
const {
  viewSheet,
} = useSheetDialog();

const song = computed(
  () => {
    const songId = route.value.query.id;
    const foundSong = dataStore.currentData.songs.find((song) => song.songId === songId) ?? null;

    if (
      songId !== undefined && foundSong === null
      && dataStore.currentLoadingStatus === LoadingStatus.LOADED
    ) {
      context.error(new PageNotFoundError());
    }

    return foundSong;
  },
);

const extraSheetHeaders = computed(() => {
  if (gameCode.value === 'maimai') {
    return ['total', 'tap', 'hold', 'slide', 'touch', 'break']
      .map((key) => ({
        key,
        title: key !== 'total' ? key.toUpperCase() : context.i18n.t('term.totalNotes'),
        get: (sheet: Sheet) => sheet.noteCounts?.[key],
      }));
  }

  return [];
});

useHead(() => ({
  title: `${song.value?.title} | ${context.i18n.t('page-title.song')}`,
}));
</script>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import type { Sheet } from '~/types';

export default defineComponent({
  name: 'GameSongPage',
  head: {},
});
</script>

<template>
  <v-container class="pa-8">
    <v-btn
      color="secondary"
      outlined
      exact
      :to="{ name: 'gameCode-songs' }"
    >
      <v-icon left>
        mdi-keyboard-return
      </v-icon>
      <span v-text="$t('ui.goBack')" />
    </v-btn>

    <template v-if="song != null">
      <h1 class="my-6">
        <span v-text="song.title" />
      </h1>

      <v-row>
        <v-col cols="12" sm="auto" class="d-flex align-center">
          <img
            :src="song.imageUrl"
            :alt="song.title"
            style="width: 300px; height: 300px; vertical-align: middle;"
          >
        </v-col>
        <v-col cols="12" sm="auto">
          <v-simple-table class="text-center">
            <tbody>
              <tr>
                <th>
                  <span v-text="$t('term.category')" />
                </th>
                <td>
                  <span v-text="song.category" />
                </td>
              </tr>
              <tr>
                <th>
                  <span v-text="$t('term.title')" />
                </th>
                <td>
                  <span v-text="song.title" />
                </td>
              </tr>
              <tr>
                <th>
                  <span v-text="$t('term.artist')" />
                </th>
                <td>
                  <span v-text="song.artist" />
                </td>
              </tr>
              <tr>
                <th>
                  <span v-text="$t('term.bpm')" />
                </th>
                <td>
                  <span v-text="song.bpm" />
                </td>
              </tr>
              <tr>
                <th>
                  <span v-text="$t('term.releaseDate')" />
                </th>
                <td>
                  <span>{{ (song.releaseDate ?? '').replaceAll('-', '/') }}</span>
                </td>
              </tr>
              <tr>
                <th>
                  <span v-text="$t('term.version')" />
                </th>
                <td>
                  <span v-text="song.version" />
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>

      <h2 class="my-6">
        <span v-text="$t('page.songs.sheetData')" />
      </h2>

      <v-row>
        <v-col cols="auto">
          <v-simple-table dense class="text-center overflow-x-auto">
            <thead>
              <th class="px-2">
                <span v-text="$t('term.type')" />
              </th>
              <th class="px-2">
                <span v-text="$t('term.difficulty')" />
              </th>
              <th class="px-2">
                <span v-text="$t('term.level')" />
              </th>
              <th class="px-2">
                <span v-text="$t('term.internalLevel')" />
              </th>
              <th
                v-for="(header, j) in extraSheetHeaders"
                :key="j"
                class="px-2"
              >
                <span v-text="header.title" />
              </th>
              <th class="px-2">
                <span v-text="$t('term.noteDesigner')" />
              </th>
            </thead>
            <tbody>
              <tr
                v-for="(sheet, i) in song.sheets"
                :key="i"
              >
                <td>
                  <span v-text="getTypeAbbr(sheet.type)" />
                </td>
                <td>
                  <v-btn
                    text
                    rounded
                    class="font-weight-bold text-none"
                    :style="{ 'color': getDifficultyColor(sheet.difficulty) }"
                    @click="
                      viewSheet(sheet);
                      $gtag('event', 'SheetViewed', { gameCode, eventSource: 'GameSongPage' });
                    "
                  >
                    <span v-text="getDifficultyName(sheet.difficulty)" />
                  </v-btn>
                </td>
                <td>
                  <span v-text="sheet.level" />
                </td>
                <td>
                  <span v-text="sheet.internalLevel" />
                </td>
                <td
                  v-for="(header, j) in extraSheetHeaders"
                  :key="j"
                >
                  <span v-text="header.get(sheet)" />
                  <v-tooltip
                    v-if="header.key === 'total' && !validateNoteCounts(sheet, gameCode)"
                    top
                  >
                    <template #activator="{ on }">
                      <span v-on="on">
                        <v-icon>mdi-alert-outline</v-icon>
                      </span>
                    </template>
                    <span v-text="$t('description.invalidNoteCounts')" />
                  </v-tooltip>
                </td>
                <td>
                  <span v-text="sheet.noteDesigner" />
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
