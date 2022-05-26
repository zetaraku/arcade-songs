<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { ref, computed, provide, useMeta as useHead } from '@nuxtjs/composition-api';
import useDataStore from '~/stores/data';
import useGameInfo from '~/composables/useGameInfo';
import useVM from '~/composables/useVM';
import { buildEmptyFilters, buildFilterOptions, filterSheets } from '~/utils';
import type { Sheet } from '~/types';

const vm = useVM();
const { gameTitle } = useGameInfo();
const dataStore = useDataStore();
const data = computed(() => dataStore.currentData);

const filterMode = ref('filter');
const displayMode = ref('grid');

const filters = ref(buildEmptyFilters());
const filterOptions = computed(() => buildFilterOptions(data.value, vm.$t.bind(vm)));
const filteredSheets = computed(() => filterSheets(data.value.sheets, filters.value));

const selectedSheets = ref<Sheet[]>([]);
const displayingSheets = computed(() => {
  if (filterMode.value === 'my-list') return selectedSheets.value;
  if (filterMode.value === 'filter') return filteredSheets.value;
  throw new Error('Invalid filter mode');
});

useHead(() => ({
  titleTemplate: '%s',
  title: `${gameTitle.value} | ${vm.$config.siteTitle}`,
}));

provide('selectedSheets', selectedSheets);

provide('filters', filters);
provide('filterOptions', filterOptions);

provide('displayMode', displayMode);
provide('filterMode', filterMode);
</script>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'GameIndexPage',
  head: {},
});
</script>

<template>
  <v-container fluid class="pa-8">
    <DataInfoBar class="mb-6" />

    <SheetFilter class="px-3" />
    <ModeSelector class="px-3" />

    <SheetDrawerPanel
      :sheets="displayingSheets"
    />

    <FilterInfoBar
      :sheets="displayingSheets"
      class="my-5"
    />

    <SheetDataView
      v-show="displayingSheets.length > 0"
      :sheets="displayingSheets"
      :display-mode="displayMode"
      class="mt-8"
    />

    <div
      v-if="filterMode === 'my-list' && displayingSheets.length === 0"
      class="text-center text--secondary py-8"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="$t('description.myListEmpty')" />
    </div>
  </v-container>
</template>
