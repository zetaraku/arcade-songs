<script setup lang="ts">
import { computed } from '@nuxtjs/composition-api';
import useDataStore from '~/stores/data';
import type { Sheet } from '~/types';

const props = defineProps<{
  sheets: Sheet[];
}>();

const dataStore = useDataStore();
const data = computed(() => dataStore.currentData);
const songs = computed(() => [...new Set(props.sheets.map((sheet) => sheet.songNo))]);
</script>

<template>
  <v-container fluid>
    <v-progress-linear
      height="30"
      color="lime"
      :value="(sheets.length / data.sheets.length) * 100"
      class="text-center"
    >
      <span class="text-truncate black--text">
        {{ sheets.length }} / {{ $t('sfc.FilterInfoBar.sheetsCount', { n: data.sheets.length }) }}
        ( {{ songs.length }} / {{ $t('sfc.FilterInfoBar.songsCount', { n: data.songs.length }) }} )
      </span>
    </v-progress-linear>
  </v-container>
</template>
