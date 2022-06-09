<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { ref, computed, watch, provide, inject, onMounted, useRoute, useRouter, useMeta as useHead, useContext, Ref } from '@nuxtjs/composition-api';
import { useI18n } from 'nuxt-i18n-composable';
import useDataStore from '~/stores/data';
import useGameInfo from '~/composables/useGameInfo';
import { buildEmptyFilters, buildFilterOptions, loadFiltersFromQuery, filterSheets, NULL_SHEET, RICK_SHEET } from '~/utils';
import ItemDrawer from '~/utils/ItemDrawer';
import type { Sheet } from '~/types';

const isDarkMode: Ref<boolean> = inject('isDarkMode')!;

const context = useContext();
const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const { gameTitle } = useGameInfo();
const dataStore = useDataStore();
const data = computed(() => dataStore.currentData);

const filterMode = ref('filter');
const displayMode = ref('grid');
const drawMode = ref('single');

const filters = ref(buildEmptyFilters());
const filterOptions = computed(() => buildFilterOptions(data.value, i18n.t));

const comboDrawer = new ItemDrawer<Sheet>({ drawSize: 4 });

const filteredSheets = computed(
  () => filterSheets(data.value.sheets, filters.value),
);
const selectedSheets = ref<Sheet[]>([]);
const comboSheets = computed(
  () => comboDrawer.currentItems.value.map((sheet) => sheet ?? NULL_SHEET),
);
const secretSheets = computed(
  () => [...Array(4)].map(() => (isDarkMode.value ? RICK_SHEET : NULL_SHEET)),
);

const drawingPool = computed(() => {
  if (filterMode.value === 'filter') return filteredSheets.value;
  if (filterMode.value === 'my-list') return selectedSheets.value;
  throw new Error('Invalid drawing pool');
});
const displayingSheets = computed(() => {
  if (drawMode.value === 'combo') return comboSheets.value;
  if (drawMode.value === 'secret') return secretSheets.value;
  return drawingPool.value;
});

onMounted(() => {
  filters.value = loadFiltersFromQuery(route.value.query as Record<string, string>);
  router.replace({ query: {} }).catch((err) => {
    // Ignore the error regarding navigating to the page they are already on.
    if (err.name !== 'NavigationDuplicated') throw err;
  });
});

useHead(() => ({
  titleTemplate: '%s',
  title: `${gameTitle.value} | ${context.$config.siteTitle}`,
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
    <ModeSelector class="px-3 py-3" />

    <SheetDrawerPanel />

    <FilterInfoBar
      :sheets="displayingSheets"
      class="my-5"
    />

    <!--
      The inner SheetDataGrid and SheetDataTable need to sync with each other.
      To ensure the SheetDataView always exists, we use v-show instead of v-if.
    -->
    <SheetDataView
      v-show="displayingSheets.length > 0"
      :sheets="displayingSheets"
      :display-mode="displayMode"
      class="mt-8"
    />
    <div
      v-if="displayingSheets.length === 0"
      class="text-center text--secondary py-8"
    >
      <span
        v-if="filterMode === 'filter'"
        v-text="$t('description.filterResultEmpty')"
      />
      <span
        v-if="filterMode === 'my-list'"
        v-text="$t('description.myListEmpty')"
      />
    </div>
  </v-container>
</template>
