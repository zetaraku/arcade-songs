<script setup lang="ts">
import { ref, inject, Ref, useContext } from '@nuxtjs/composition-api';
import YAML from 'yaml';
import QueryString from 'query-string';
import copyToClipboard from 'copy-to-clipboard';
import selectFiles from 'select-files';
import { useDataStore } from '~/stores/data';
import useGtag from '~/composables/useGtag';
import useSentry from '~/composables/useSentry';
import useGameInfo from '~/composables/useGameInfo';
import useSelectedSheets from '~/composables/useSelectedSheets';
import MyListExportDialog from '~/components/dialogs/MyListExportDialog.vue';
import { saveFiltersAsQuery, makeDummySheet } from '~/utils';
import type { Filters } from '~/types';

const displayMode: Ref<string> = inject('displayMode')!;
const filterMode: Ref<string> = inject('filterMode')!;
const filters: Ref<Filters> = inject('filters')!;

const context = useContext();
const gtag = useGtag();
const sentry = useSentry();
const dataStore = useDataStore();
const { gameCode } = useGameInfo();
const { selectedSheets } = useSelectedSheets();

const isMyListExportDialogOpened = ref(false);

function copyFilterLink() {
  const query = saveFiltersAsQuery(filters.value);

  if (Object.keys(query).length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(context.i18n.t('sfc.ModeSelector.noFilterWarn'));
    return;
  }

  const rawQuery = QueryString.stringify(query);

  const url = QueryString.stringifyUrl({ url: window.location.href, query });
  copyToClipboard(url, { format: 'text/plain' });

  // eslint-disable-next-line no-alert
  window.alert(`${url}\n${context.i18n.t('description.copied')}`);

  gtag('event', 'FilterLinkCopied', { gameCode: gameCode.value, eventSource: 'ModeSelector', query: rawQuery });
}
function toggleSuperFilter() {
  if (filters.value.superFilter === null) {
    filters.value.superFilter = '';

    gtag('event', 'SuperFilterShown', { gameCode: gameCode.value, eventSource: 'ModeSelector' });
  } else {
    filters.value.superFilter = null;
  }
}
async function showMyListExportDialog() {
  if (selectedSheets.value.length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(context.i18n.t('sfc.ModeSelector.myListEmptyWarn'));
    return;
  }

  isMyListExportDialogOpened.value = true;

  gtag('event', 'MyListExportDialogShown', { gameCode: gameCode.value, eventSource: 'ModeSelector' });
}
async function importSelectedSheets() {
  const files = await selectFiles({ accept: '.yaml', multiple: false });

  if (files === null || files.length === 0) return;

  try {
    const file = files[0];
    const sheetExprs = [...new Set(YAML.parse(await file.text()))] as string[];

    const loadedSheets = sheetExprs.map(
      (sheetExpr) => dataStore.currentData.sheets.find(
        (sheet) => sheet.sheetExpr === sheetExpr,
      ) ?? makeDummySheet(sheetExpr),
    );
    selectedSheets.value = loadedSheets;

    // eslint-disable-next-line no-alert
    window.alert(context.i18n.t('sfc.ModeSelector.sheetsLoaded', { n: loadedSheets.length }));

    gtag('event', 'MyListImported', { gameCode: gameCode.value, eventSource: 'ModeSelector' });
  } catch (err) {
    sentry.captureException(err);

    // eslint-disable-next-line no-alert
    window.alert(`An error occurred while loading '${files[0].name}':\n\n${err}`);
  }
}
</script>

<template>
  <div>
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="6"
        class="d-flex justify-center align-center"
      >
        <v-radio-group
          v-model="displayMode"
          row
          @change="
            $gtag('event', 'DisplayModeChanged', {
              gameCode,
              eventSource: 'ModeSelector',
              displayMode: $event,
            });
          "
        >
          <v-radio value="grid">
            <template #label>
              <span>
                <v-icon>mdi-view-grid-outline</v-icon>
                <span v-text="$t('sfc.ModeSelector.gridMode')" />
              </span>
            </template>
          </v-radio>
          <v-radio value="table">
            <template #label>
              <span>
                <v-icon>mdi-table</v-icon>
                <span v-text="$t('sfc.ModeSelector.tableMode')" />
              </span>
            </template>
          </v-radio>
          <v-radio value="chart">
            <template #label>
              <span>
                <v-icon>mdi-chart-bar</v-icon>
                <span v-text="$t('sfc.ModeSelector.chartMode')" />
                <v-badge
                  inline
                  color="error"
                  style="font-weight: bold;"
                  content="NEW!"
                />
              </span>
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        class="d-flex justify-center align-center"
      >
        <v-radio-group
          v-model="filterMode"
          row
          @change="
            $gtag('event', 'FilterModeChanged', {
              gameCode,
              eventSource: 'ModeSelector',
              filterMode: $event,
            });
          "
        >
          <v-radio value="filter">
            <template #label>
              <span>
                <v-icon>mdi-filter-menu-outline</v-icon>
                <span v-text="$t('sfc.ModeSelector.filterMode')" />
              </span>
            </template>
          </v-radio>
          <v-radio value="my-list">
            <template #label>
              <span>
                <v-icon>mdi-playlist-music</v-icon>
                <span v-text="$t('sfc.ModeSelector.myListMode')" />
                <v-badge
                  v-if="selectedSheets.length > 0"
                  inline
                  color="error"
                  style="font-weight: bold;"
                  :content="selectedSheets.length"
                />
              </span>
            </template>
          </v-radio>
        </v-radio-group>

        <template v-if="filterMode === 'filter'">
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                icon
                large
                color="green"
                @click="copyFilterLink"
                v-on="on"
              >
                <v-icon>mdi-link-box-variant</v-icon>
              </v-btn>
            </template>
            <span v-text="$t('sfc.ModeSelector.copyFilterLink')" />
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                icon
                large
                color="grey darken-1"
                @click="toggleSuperFilter"
                v-on="on"
              >
                <v-badge
                  color="error"
                  style="font-weight: bold;"
                  content="NEW!"
                >
                  <v-icon>mdi-code-braces-box</v-icon>
                </v-badge>
              </v-btn>
            </template>
            <span v-text="$t('term.superFilter')" />
          </v-tooltip>
        </template>
        <template v-if="filterMode === 'my-list'">
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                icon
                large
                color="cyan"
                @click="showMyListExportDialog"
                v-on="on"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </template>
            <span v-text="$t('sfc.ModeSelector.exportMyList')" />
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                icon
                large
                color="red"
                @click="importSelectedSheets"
                v-on="on"
              >
                <v-icon>mdi-upload</v-icon>
              </v-btn>
            </template>
            <span v-text="$t('sfc.ModeSelector.importMyList')" />
          </v-tooltip>
        </template>
      </v-col>
    </v-row>

    <MyListExportDialog v-model="isMyListExportDialogOpened" />
  </div>
</template>
