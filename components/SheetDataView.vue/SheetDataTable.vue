<script setup lang="ts">
import { watch, inject, Ref } from '@nuxtjs/composition-api';
import useGameInfo from '~/composables/useGameInfo';
import useGameData from '~/composables/useGameData';
import useSheetDialog from '~/composables/useSheetDialog';
import useSheetHeaders from '~/composables/useSheetHeaders';
import { toPercentageString, validateNoteCounts } from '~/utils';
import type { Sheet } from '~/types';

const sheets: Ref<Sheet[]> = inject('sheets')!;
const filterMode: Ref<string> = inject('filterMode')!;
const selectedSheets: Ref<Sheet[]> = inject('selectedSheets')!;
const toggleSheetSelection: (sheet: Sheet) => void = inject('toggleSheetSelection')!;

const currentSheets: Ref<Sheet[]> = inject('currentSheets')!;
const sortBy: Ref<string> = inject('sortBy')!;
const sortDesc: Ref<boolean> = inject('sortDesc')!;

const sheetsPerPage: Ref<number> = inject('sheetsPerPage')!;
const pageCount: Ref<number> = inject('pageCount')!;
const currentPage: Ref<number> = inject('currentPage')!;

const { gameCode } = useGameInfo();
const {
  getVersionAbbr,
  getTypeAbbr,
  getTypeIconUrl,
  getTypeIconHeight,
  getDifficultyName,
  getDifficultyColor,
  getDifficultyIconUrl,
  getDifficultyIconHeight,
} = useGameData();
const { viewSheet } = useSheetDialog();
const headers = useSheetHeaders();

function getItemClass(sheet: Sheet) {
  return filterMode.value !== 'my-list' && selectedSheets.value.includes(sheet) ? 'selected-sheet' : '';
}

watch(sheets, () => {
  currentPage.value = 1;
});
</script>

<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <div>
    <v-data-table
      :headers="headers"
      :items="sheets"
      :item-class="getItemClass"
      :items-per-page="sheetsPerPage"
      :page.sync="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      must-sort
      hide-default-footer
      @page-count="pageCount = $event;"
      @current-items="currentSheets = $event;"
      @contextmenu:row.prevent="toggleSheetSelection(arguments[1].item);"
    >
      <!-- This is explicitly added for the variables used in v-on to be exposed correctly -->
      <template v-if="false">
        {{ pageCount }}
        {{ currentSheets }}
      </template>

      <template #item.category="{ item: sheet }">
        <span>{{ (sheet.category ?? '').replaceAll('|', '｜') }}</span>
      </template>
      <template #item.title="{ item: sheet }">
        <v-btn
          icon
          color="cyan"
          @click="
            viewSheet(sheet);
            $gtag('event', 'SheetViewed', { gameCode, eventSource: 'SheetDataTable' });
          "
        >
          <v-icon>mdi-file-image</v-icon>
        </v-btn>
        <span v-text="sheet.title" />
        <v-tooltip v-if="sheet.isLocked" top>
          <template #activator="{ on }">
            <v-icon right color="yellow darken-2" v-on="on">
              mdi-lock
            </v-icon>
          </template>
          <span v-text="$t('description.unlockNeeded')" />
        </v-tooltip>
        <v-tooltip v-if="sheet.isNew" top>
          <template #activator="{ on }">
            <v-icon right color="yellow darken-2" v-on="on">
              mdi-star
            </v-icon>
          </template>
          <span v-text="$t('description.newSong')" />
        </v-tooltip>
      </template>
      <template #item.type="{ item: sheet }">
        <template v-if="getTypeIconUrl(sheet.type) != null">
          <img
            :src="getTypeIconUrl(sheet.type)"
            :height="getTypeIconHeight(sheet.type)"
            :alt="getTypeAbbr(sheet.type)"
            style="vertical-align: middle;"
          >
        </template>
        <template v-else>
          <span v-text="getTypeAbbr(sheet.type)" />
        </template>
      </template>
      <template #item.difficulty="{ item: sheet }">
        <div
          class="font-weight-bold"
          :style="{ 'color': getDifficultyColor(sheet.difficulty) }"
        >
          <img
            v-if="getDifficultyIconUrl(sheet.difficulty) != null"
            :src="getDifficultyIconUrl(sheet.difficulty)"
            :height="getDifficultyIconHeight(sheet.difficulty)"
            alt=""
            class="mr-1"
            style="vertical-align: middle;"
          >
          <span v-text="getDifficultyName(sheet.difficulty)" />
        </div>
      </template>
      <template #item.levelValue="{ item: sheet }">
        <div
          class="font-weight-bold"
          :style="{ 'color': getDifficultyColor(sheet.difficulty) }"
        >
          <span v-text="sheet.level" />
        </div>
      </template>
      <template #item.internalLevelValue="{ item: sheet }">
        <div>
          <span v-text="sheet.internalLevel" />
        </div>
      </template>

      <!-- Note counts and Note percents: maimai, chunithm -->
      <template #item.notePercents.tap="{ item: sheet }">
        <span>{{ sheet.notePercents ? toPercentageString(sheet.notePercents.tap) : null }}</span>
      </template>
      <template #item.notePercents.hold="{ item: sheet }">
        <span>{{ sheet.notePercents ? toPercentageString(sheet.notePercents.hold) : null }}</span>
      </template>
      <template #item.notePercents.slide="{ item: sheet }">
        <span>{{ sheet.notePercents ? toPercentageString(sheet.notePercents.slide) : null }}</span>
      </template>
      <template #item.notePercents.touch="{ item: sheet }">
        <span>{{ sheet.notePercents ? toPercentageString(sheet.notePercents.touch) : null }}</span>
      </template>
      <template #item.notePercents.break="{ item: sheet }">
        <span>{{ sheet.notePercents ? toPercentageString(sheet.notePercents.break) : null }}</span>
      </template>
      <template #item.notePercents.air="{ item: sheet }">
        <span>{{ sheet.notePercents ? toPercentageString(sheet.notePercents.air) : null }}</span>
      </template>
      <template #item.notePercents.flick="{ item: sheet }">
        <span>{{ sheet.notePercents ? toPercentageString(sheet.notePercents.flick) : null }}</span>
      </template>
      <template #item.noteCounts.total="{ item: sheet }">
        <span>{{ sheet.noteCounts ? sheet.noteCounts.total : null }}</span>
        <v-tooltip
          v-if="!validateNoteCounts(sheet, gameCode)"
          top
        >
          <template #activator="{ on }">
            <v-icon v-on="on">
              mdi-alert-outline
            </v-icon>
          </template>
          <span v-text="$t('description.invalidNoteCounts')" />
        </v-tooltip>
      </template>

      <template #item.noteDesigner="{ item: sheet }">
        <span v-text="sheet.noteDesigner" />
      </template>
      <template #item.version="{ item: sheet }">
        <span v-text="getVersionAbbr(sheet.version)" />
      </template>
    </v-data-table>
  </div>
</template>

<style lang="scss" scoped>
::v-deep {
  .selected-sheet {
    background-color: #4eda !important;
  }
}
</style>
