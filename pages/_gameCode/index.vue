<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { ref, computed, provide, onMounted, useRoute, useRouter, useMeta as useHead, useContext } from '@nuxtjs/composition-api';
import useGtag from '~/composables/useGtag';
import { useDataStore } from '~/stores/data';
import useGameInfo from '~/composables/useGameInfo';
import DataInfoBar from '~/components/DataInfoBar.vue';
import SheetFilter from '~/components/SheetFilter.vue';
import ModeSelector from '~/components/ModeSelector.vue';
import SheetDrawerPanel from '~/components/SheetDrawerPanel.vue';
import FilterInfoBar from '~/components/FilterInfoBar.vue';
import SheetDataView from '~/components/SheetDataView.vue';
import { buildEmptyFilters, buildFilterOptions, loadFiltersFromQuery, filterSheets, pickItem, getRegionOverrideSheet, isCanonicalSheet } from '~/utils';
import type { Sheet } from '~/types';

const context = useContext();
const gtag = useGtag();
const route = useRoute();
const router = useRouter();
const dataStore = useDataStore();
const { gameCode, gameTitle } = useGameInfo();

const data = computed(() => dataStore.currentData);

const filterMode = ref('filter');
const displayMode = ref('grid');

const filters = ref(buildEmptyFilters());
const filterOptions = computed(() => buildFilterOptions(data.value, context.i18n));

const filteredSheets = computed(
  () => filterSheets(data.value.sheets, filters.value),
);
const selectedSheets = ref<Sheet[]>([]);

const preDisplayingSheets = computed(() => {
  if (filterMode.value === 'filter') return filteredSheets.value;
  if (filterMode.value === 'my-list') return selectedSheets.value;
  throw new Error('Invalid filter mode');
});

const displayingSheets = computed(() => {
  if (filters.value.useRegionOverride) {
    const currentRegion = filters.value.region != null && !filters.value.region.startsWith('!') ? filters.value.region : null;

    if (currentRegion != null) {
      return preDisplayingSheets.value.map((sheet) => getRegionOverrideSheet(sheet, currentRegion));
    }
  }

  return preDisplayingSheets.value;
});

const unselectedSheets = computed(() => filteredSheets.value.filter(
  (sheet) => !selectedSheets.value.includes(sheet),
));

function toggleSheetSelection(sheet: Sheet) {
  if (!isCanonicalSheet(sheet)) {
    // eslint-disable-next-line no-console
    console.warn('Non-canonical sheet should not be used as selected sheets.');
  }

  const index = selectedSheets.value.indexOf(sheet);
  if (index === -1) {
    selectedSheets.value.push(sheet);
  } else {
    selectedSheets.value.splice(index, 1);
  }
}

function pickFromFilter() {
  if (unselectedSheets.value.length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(context.i18n.t('description.noMoreSheetsToPick'));
    return;
  }

  const selectedSheet = pickItem(unselectedSheets.value);
  selectedSheets.value.push(selectedSheet);

  gtag('event', 'RandomSheetPicked', { gameCode: gameCode.value, eventSource: 'GameIndexPage' });
}

onMounted(() => {
  const rawQuery = window.location.search.substring(1);

  filters.value = loadFiltersFromQuery(route.value.query as Record<string, string>);

  // clear the query params
  router.replace({ query: {} })
    .then(() => {
      // Some filters are loaded from link if some query params are cleared
      gtag('event', 'FilterLinkLoaded', { gameCode: gameCode.value, eventSource: 'GameIndexPage', query: rawQuery });
    })
    .catch((err) => {
      // Ignore the error regarding navigating to the page they are already on.
      if (err.name !== 'NavigationDuplicated') throw err;
    });
});

useHead(() => ({
  titleTemplate: '%s',
  title: `${gameTitle.value} | ${context.$config.siteTitle}`,
}));

provide('drawingPool', displayingSheets);
provide('selectedSheets', selectedSheets);
provide('toggleSheetSelection', toggleSheetSelection);

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
  <v-container fluid class="pa-4 pa-sm-8">
    <DataInfoBar class="mb-6" />

    <SheetFilter class="px-3" />
    <ModeSelector class="px-3 py-3" />

    <SheetDrawerPanel />

    <FilterInfoBar
      :sheets="displayingSheets"
      class="my-6"
    />

    <div
      v-if="filterMode === 'my-list'"
      class="text-center py-8"
    >
      <v-btn
        color="info"
        outlined
        @click="pickFromFilter();"
      >
        {{ $t('description.pickOneFromFilter') }}
      </v-btn>
    </div>

    <!--
      The inner SheetDataGrid and SheetDataTable need to sync with each other.
      To ensure the SheetDataView always exists, we use v-show instead of v-if.
    -->
    <SheetDataView
      v-show="displayingSheets.length > 0 || displayMode === 'chart'"
      :sheets="displayingSheets"
      :display-mode="displayMode"
      class="mt-4"
    />
    <div
      v-if="displayingSheets.length === 0 && displayMode !== 'chart'"
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

    <div
      v-if="filterMode === 'my-list' && selectedSheets.length > 0"
      class="text-center py-8"
    >
      <v-btn
        color="error"
        outlined
        @click="selectedSheets = [];"
      >
        {{ $t('description.clearMyList') }}
      </v-btn>
    </div>
  </v-container>
</template>
