<script setup lang="ts">
import { watch, inject, Ref } from '@nuxtjs/composition-api';
import useGameInfo from '~/composables/useGameInfo';
import useGameData from '~/composables/useGameData';
import useSheetTableHeaders from '~/composables/useSheetTableHeaders';
import useSheetDialog from '~/composables/useSheetDialog';
import { toPercentageString, validateNoteCounts } from '~/utils';
import type { Sheet } from '~/types';

const sheets: Ref<Sheet[]> = inject('sheets')!;
const selectedSheets: Ref<Sheet[]> = inject('selectedSheets')!;

const sheetsPerPage: Ref<number> = inject('sheetsPerPage')!;
const pageCount: Ref<number> = inject('pageCount')!;
const currentPage: Ref<number> = inject('currentPage')!;
const currentSheets: Ref<Sheet[]> = inject('currentSheets')!;

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
const { headers } = useSheetTableHeaders();
const { viewSheet } = useSheetDialog();

function getItemClass(sheet: Sheet) {
  return selectedSheets.value.includes(sheet) ? 'selected-sheet' : '';
}

watch(sheets, () => {
  currentPage.value = 1;
});
</script>

<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <div>
    <v-data-table
      v-model="selectedSheets"
      :headers="headers"
      :items="sheets"
      :item-class="getItemClass"
      :items-per-page="sheetsPerPage"
      :page.sync="currentPage"
      item-key="sheetNo"
      must-sort
      show-select
      hide-default-footer
      @page-count="pageCount = $event;"
      @current-items="currentSheets = $event;"
    >
      <!-- This is explicitly added for the variables used in v-on to be exposed correctly -->
      <template v-if="false">
        {{ pageCount }}
        {{ currentSheets }}
      </template>

      <template #item.category="{ item: sheet }">
        <span>{{ (sheet.category || 'N/A').replaceAll('|', '｜') }}</span>
      </template>
      <template #item.title="{ item: sheet }">
        <v-btn
          icon
          color="cyan"
          @click.stop="viewSheet(sheet);"
        >
          <v-icon>mdi-file-image</v-icon>
        </v-btn>
        <span>{{ sheet.title }}</span>
        <v-tooltip v-if="sheet.isLocked" top>
          <template #activator="{ on }">
            <v-icon right color="yellow darken-2" v-on="on">
              mdi-lock
            </v-icon>
          </template>
          <span>{{ $t('description.unlockNeeded') }}</span>
        </v-tooltip>
        <v-tooltip v-if="sheet.isNew" top>
          <template #activator="{ on }">
            <v-icon right color="yellow darken-2" v-on="on">
              mdi-star
            </v-icon>
          </template>
          <span>{{ $t('description.newSong') }}</span>
        </v-tooltip>
      </template>
      <template #item.type="{ item: sheet }">
        <span v-if="getTypeIconUrl(sheet.type) != null">
          <img
            :src="getTypeIconUrl(sheet.type)"
            :height="getTypeIconHeight(sheet.type)"
            :alt="getTypeAbbr(sheet.type)"
            style="vertical-align: middle;"
          >
        </span>
        <span v-else>{{ getTypeAbbr(sheet.type) }}</span>
      </template>
      <template #item.difficulty="{ item: sheet }">
        <div
          class="font-weight-bold"
          :style="{ 'color': getDifficultyColor(sheet.difficulty) }"
        >
          <span v-if="getDifficultyIconUrl(sheet.difficulty) != null">
            <img
              :src="getDifficultyIconUrl(sheet.difficulty)"
              :height="getDifficultyIconHeight(sheet.difficulty)"
              alt=""
              class="mr-1"
              style="vertical-align: middle;"
            >
          </span>
          <span>{{ getDifficultyName(sheet.difficulty) }}</span>
        </div>
      </template>
      <template #item.levelValue="{ item: sheet }">
        <div
          class="font-weight-bold"
          :style="{ 'color': getDifficultyColor(sheet.difficulty) }"
        >
          <span>{{ sheet.level }}</span>
        </div>
      </template>

      <!-- Note counts and Note percents -->
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
      <template #item.noteCounts.total="{ item: sheet }">
        <span>{{ sheet.noteCounts.total }}</span>
        <v-tooltip
          v-if="!validateNoteCounts(sheet, gameCode)"
          top
        >
          <template #activator="{ on }">
            <v-icon v-on="on">
              mdi-alert-outline
            </v-icon>
          </template>
          <span>{{ $t('description.invalidNoteCounts') }}</span>
        </v-tooltip>
      </template>

      <template #item.noteDesigner="{ item: sheet }">
        <span>{{ sheet.noteDesigner }}</span>
      </template>
      <template #item.version="{ item: sheet }">
        <span>{{ getVersionAbbr(sheet.version) }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<style lang="scss" scoped>
::v-deep {
  .selected-sheet {
    background-color: #4EDA !important;
  }
}
</style>
