<script setup lang="ts">
import { computed, watch, inject, Ref } from '@nuxtjs/composition-api';
import { useI18n } from 'nuxt-i18n-composable';
import useGameInfo from '~/composables/useGameInfo';
import useGameData from '~/composables/useGameData';
import useSheetDialog from '~/composables/useSheetDialog';
import { toPercentageString, validateNoteCounts } from '~/utils';
import type { DataTableHeader } from 'vuetify';
import type { Sheet } from '~/types';

const sheets: Ref<Sheet[]> = inject('sheets')!;
const selectedSheets: Ref<Sheet[]> = inject('selectedSheets')!;

const sheetsPerPage: Ref<number> = inject('sheetsPerPage')!;
const pageCount: Ref<number> = inject('pageCount')!;
const currentPage: Ref<number> = inject('currentPage')!;
const currentSheets: Ref<Sheet[]> = inject('currentSheets')!;

const i18n = useI18n();
const { gameCode } = useGameInfo();
const {
  getCategoryIndex,
  getVersionAbbr,
  getVersionIndex,
  getTypeAbbr,
  getTypeIconUrl,
  getTypeIconHeight,
  getTypeIndex,
  getDifficultyName,
  getDifficultyColor,
  getDifficultyIconUrl,
  getDifficultyIconHeight,
  getDifficultyIndex,
} = useGameData();
const { viewSheet } = useSheetDialog();

const optionalHeaders: Record<string, DataTableHeader[]> = {
  maimai: [
    {
      text: 'TAP',
      value: 'noteCounts.tap',
      width: 50,
    },
    {
      text: 'TAP %',
      value: 'notePercents.tap',
      width: 50,
    },
    {
      text: 'HOLD',
      value: 'noteCounts.hold',
      width: 50,
    },
    {
      text: 'HOLD %',
      value: 'notePercents.hold',
      width: 50,
    },
    {
      text: 'SLIDE',
      value: 'noteCounts.slide',
      width: 50,
    },
    {
      text: 'SLIDE %',
      value: 'notePercents.slide',
      width: 50,
    },
    {
      text: 'TOUCH',
      value: 'noteCounts.touch',
      width: 50,
    },
    {
      text: 'TOUCH %',
      value: 'notePercents.touch',
      width: 50,
    },
    {
      text: 'BREAK',
      value: 'noteCounts.break',
      width: 50,
    },
    {
      text: 'BREAK %',
      value: 'notePercents.break',
      width: 50,
    },
    {
      text: i18n.t('term.totalNotes') as string,
      value: 'noteCounts.total',
      width: 50,
    },
  ],
};
const headers = computed<DataTableHeader[]>(() => [
  {
    text: 'No.',
    value: 'songNo',
    width: 10,
  },
  {
    text: i18n.t('term.category') as string,
    value: 'category',
    width: 200,
    sort: (a: string, b: string) => getCategoryIndex(a) - getCategoryIndex(b),
  },
  {
    text: i18n.t('term.title') as string,
    value: 'title',
    width: 300,
  },
  {
    text: i18n.t('term.type') as string,
    value: 'type',
    width: 75,
    sort: (a: string, b: string) => getTypeIndex(a) - getTypeIndex(b),
  },
  {
    text: i18n.t('term.difficulty') as string,
    value: 'difficulty',
    width: 100,
    sort: (a: string, b: string) => getDifficultyIndex(a) - getDifficultyIndex(b),
  },
  {
    text: i18n.t('term.level') as string,
    value: 'levelValue',
    width: 100,
  },
  {
    text: i18n.t('term.internalLevel') as string,
    value: 'internalLevelValue',
    width: 100,
  },

  ...(optionalHeaders[gameCode.value!] ?? []),

  {
    text: i18n.t('term.bpm') as string,
    value: 'bpm',
    width: 50,
  },
  {
    text: i18n.t('term.noteDesigner') as string,
    value: 'noteDesigner',
    width: 150,
  },
  {
    text: i18n.t('term.version') as string,
    value: 'version',
    width: 150,
    sort: (a: string, b: string) => getVersionIndex(a) - getVersionIndex(b),
  },
]);

function getItemClass(sheet: Sheet) {
  return selectedSheets.value.includes(sheet) ? 'selected-sheet' : '';
}
function toggleSheetSelection(sheet: Sheet) {
  const index = selectedSheets.value.indexOf(sheet);
  if (index === -1) {
    selectedSheets.value.push(sheet);
  } else {
    selectedSheets.value.splice(index, 1);
  }
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
        <span>{{ (sheet.category || '').replaceAll('|', '｜') }}</span>
      </template>
      <template #item.title="{ item: sheet }">
        <v-btn
          icon
          color="cyan"
          @click="viewSheet(sheet);"
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
    background-color: #4EDA !important;
  }
}
</style>
