<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { ref, computed, watch, provide, onMounted, useMeta as useHead } from '@nuxtjs/composition-api';
import useDataStore from '~/stores/data';
import useGameInfo from '~/composables/useGameInfo';
import useVM from '~/composables/useVM';
import { buildEmptyFilters, buildFilterOptions, loadFiltersFromQuery, filterSheets, NULL_SHEET } from '~/utils';
import ItemDrawer from '~/utils/ItemDrawer';
import type { Sheet } from '~/types';

const vm = useVM();
const { gameTitle } = useGameInfo();
const dataStore = useDataStore();
const data = computed(() => dataStore.currentData);

const filterMode = ref('filter');
const displayMode = ref('grid');
const drawMode = ref('single');

const filters = ref(buildEmptyFilters());
const filterOptions = computed(() => buildFilterOptions(data.value, vm.$t.bind(vm)));
const filteredSheets = computed(() => filterSheets(data.value.sheets, filters.value));

const comboDrawer = new ItemDrawer<Sheet>({ drawSize: 4 });
const comboSheets = computed(
  () => comboDrawer.currentItems.value.map((sheet) => sheet ?? NULL_SHEET),
);
const selectedSheets = ref<Sheet[]>([]);
const drawingPool = computed(() => {
  if (filterMode.value === 'my-list') return selectedSheets.value;
  if (filterMode.value === 'filter') return filteredSheets.value;
  throw new Error('Invalid drawing pool');
});
const displayingSheets = computed(() => {
  if (drawMode.value === 'combo') return comboSheets.value;
  if (filterMode.value === 'my-list') return selectedSheets.value;
  if (filterMode.value === 'filter') return filteredSheets.value;
  throw new Error('Invalid filter mode');
});

onMounted(() => {
  filters.value = loadFiltersFromQuery(vm.$route.query as Record<string, string>);
  vm.$router.replace({ query: {} }).catch((err) => {
    // Ignore the error regarding navigating to the page they are already on.
    if (err.name !== 'NavigationDuplicated') throw err;
  });
});

useHead(() => ({
  titleTemplate: '%s',
  title: `${gameTitle.value} | ${vm.$config.siteTitle}`,
}));

watch(drawMode, () => {
  if (drawMode.value !== 'combo') {
    comboDrawer.stopDrawing();
    comboDrawer.resetCurrentItems();
  }
});

provide('comboDrawer', comboDrawer);
provide('drawingPool', drawingPool);
provide('selectedSheets', selectedSheets);

provide('filters', filters);
provide('filterOptions', filterOptions);

provide('displayMode', displayMode);
provide('filterMode', filterMode);
provide('drawMode', drawMode);
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
    <div id="drawComboAnchor" />
    <ModeSelector class="px-3" />

    <SheetDrawerPanel />

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
      <span v-text="$t('description.myListEmpty')" />
    </div>
  </v-container>
</template>
