<script setup lang="ts">
import { inject, Ref } from '@nuxtjs/composition-api';
import QueryString from 'query-string';
import copyToClipboard from 'copy-to-clipboard';
import FileSaver from 'file-saver';
import selectFiles from 'select-files';
import useDataStore from '~/stores/data';
import useVM from '~/composables/useVM';
import useGameInfo from '~/composables/useGameInfo';
import { saveFiltersAsQuery, computeSheetExpr, makeDummySheet, toLocalISODateString } from '~/utils';
import { Sheet, Filters } from '~/types';

const displayMode: Ref<string> = inject('displayMode')!;
const filterMode: Ref<string> = inject('filterMode')!;
const filters: Ref<Filters> = inject('filters')!;
const selectedSheets: Ref<Sheet[]> = inject('selectedSheets')!;

const vm = useVM();
const dataStore = useDataStore();
const { gameCode } = useGameInfo();

function copyFilterLink() {
  const query = saveFiltersAsQuery(filters.value);

  if (Object.keys(query).length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(vm.$t('sfc.ModeSelector.noFilterWarn'));
    return;
  }

  const url = QueryString.stringifyUrl({ url: window.location.href, query });
  copyToClipboard(url, { format: 'text/plain' });

  // eslint-disable-next-line no-alert
  window.alert(`${url}\n${vm.$t('description.copied')}`);

  (vm as any).$gtag('event', 'FilterLinkCopied', { game_code: gameCode.value });
}
async function exportSelectedSheets() {
  if (selectedSheets.value.length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(vm.$t('sfc.ModeSelector.myListEmptyWarn'));
    return;
  }

  try {
    const json = JSON.stringify(
      [...selectedSheets.value.map((sheet) => computeSheetExpr(sheet))],
      null,
      '\t',
    );
    FileSaver.saveAs(
      new Blob([json], { type: 'application/json; charset=utf-8;' }),
      `${gameCode.value}-mylist-${toLocalISODateString(new Date()).replaceAll('-', '')}.json`,
    );

    (vm as any).$gtag('event', 'ExportSelectedSheets', { game_code: gameCode.value });
  } catch (e) {
    // eslint-disable-next-line no-alert
    window.alert(`An error occurred while saving MY LIST:\n${e}`);
  }
}
async function importSelectedSheets() {
  const files = await selectFiles({ accept: 'application/json', multiple: false });

  if (files === null || files.length === 0) return;

  try {
    const file = files[0];
    const sheetExprs = [...new Set(JSON.parse(await file.text()))] as string[];

    const loadedSheets = sheetExprs.map(
      (sheetExpr) => dataStore.currentData.sheets.find(
        (sheet) => sheet.sheetExpr === sheetExpr,
      ) ?? makeDummySheet(sheetExpr),
    );
    selectedSheets.value = loadedSheets;

    // eslint-disable-next-line no-alert
    window.alert(vm.$t('sfc.ModeSelector.sheetsLoaded', { n: loadedSheets.length }));

    (vm as any).$gtag('event', 'ImportSelectedSheets', { game_code: gameCode.value });
  } catch (e) {
    // eslint-disable-next-line no-alert
    window.alert(`An error occurred while loading '${files[0].name}':\n\n${e}`);
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
        >
          <v-radio value="grid">
            <template #label>
              <span>
                <v-icon>mdi-view-grid-outline</v-icon>
                {{ $t('sfc.ModeSelector.gridMode') }}
              </span>
            </template>
          </v-radio>
          <v-radio value="table">
            <template #label>
              <span>
                <v-icon>mdi-table</v-icon>
                {{ $t('sfc.ModeSelector.tableMode') }}
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
        >
          <v-radio value="filter">
            <template #label>
              <span>
                <v-icon>mdi-filter-menu-outline</v-icon>
                {{ $t('sfc.ModeSelector.filterMode') }}
              </span>
            </template>
          </v-radio>
          <v-radio value="my-list">
            <template #label>
              <span>
                <v-icon>mdi-playlist-music</v-icon>
                {{ $t('sfc.ModeSelector.myListMode') }}
                ({{ selectedSheets.length }})
              </span>
            </template>
          </v-radio>
        </v-radio-group>

        <template v-if="filterMode === 'filter'">
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                icon
                x-large
                color="green"
                class="mx-4"
                @click="copyFilterLink"
                v-on="on"
              >
                <v-icon>mdi-link-box-variant</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('sfc.ModeSelector.copyFilterLink') }}</span>
          </v-tooltip>
        </template>
        <template v-if="filterMode === 'my-list'">
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                icon
                large
                color="cyan"
                @click="exportSelectedSheets"
                v-on="on"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('sfc.ModeSelector.exportMyList') }}</span>
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
            <span>{{ $t('sfc.ModeSelector.importMyList') }}</span>
          </v-tooltip>
        </template>
      </v-col>
    </v-row>
  </div>
</template>
