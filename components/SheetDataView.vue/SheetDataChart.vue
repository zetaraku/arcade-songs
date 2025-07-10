<script setup lang="ts">
import { computed, inject, useContext, Ref } from '@nuxtjs/composition-api';
import VChart from 'vue-echarts/dist/csp';
import * as echarts from 'echarts';
import sleep from 'sleep-promise';
import { useDataStore } from '~/stores/data';
import useI18n from '~/composables/useI18n';
import useGtag from '~/composables/useGtag';
import useGameInfo from '~/composables/useGameInfo';
import useGameData from '~/composables/useGameData';
import useSheetComboDialog from '~/composables/useSheetComboDialog';
import type { Sheet, Filters, FilterOptions } from '~/types';
import 'vue-echarts/dist/csp/style.css';

const sheets: Ref<Sheet[]> = inject('sheets')!;
const filters: Ref<Filters> = inject('filters')!;
const filterOptions: Ref<FilterOptions> = inject('filterOptions')!;

const context = useContext();
const i18n = useI18n();
const gtag = useGtag();
const dataStore = useDataStore();
const { gameCode } = useGameInfo();
const { getTypeIndex, getDifficultyIndex } = useGameData();
const { viewSheetCombo } = useSheetComboDialog();

const data = computed(() => dataStore.currentData);
const sortedSheets = computed(() => sheets.value.toSorted(
  (a, b) => 0
    || (b.levelValue ?? 0) - (a.levelValue ?? 0)
    || (b.internalLevelValue ?? 0) - (a.internalLevelValue ?? 0)
    || (b.internalLevel != null ? 1 : 0) - (a.internalLevel != null ? 1 : 0)
    || (getDifficultyIndex(b.difficulty)) - (getDifficultyIndex(a.difficulty))
    || (getTypeIndex(a.type)) - (getTypeIndex(b.type)),
));

function getSheetLevelValueInUse(sheet: Sheet) {
  return (
    filters.value.useInternalLevel
      ? sheet.internalLevelValue
      : sheet.levelValue
  );
}

function getSheetDifficultyInUse(sheet: Sheet) {
  return (
    data.value.difficulties.some((e) => sheet.difficulty === e.difficulty)
      ? sheet.difficulty
      : null
  );
}

const currentLevelFilterOptions = computed(() => (
  filters.value.useInternalLevel
    ? filterOptions.value.internalLevels
    : filterOptions.value.levels
));

const currentLevelValueRange = computed(() => (
  sheets.value
    .map((sheet) => getSheetLevelValueInUse(sheet))
    .filter((levelValue) => levelValue != null)
    .reduce(
      ({ minLevelValue, maxLevelValue }, levelValue) => ({
        minLevelValue: Math.min(levelValue, minLevelValue),
        maxLevelValue: Math.max(levelValue, maxLevelValue),
      }),
      {
        minLevelValue: +Infinity,
        maxLevelValue: -Infinity,
      },
    )
));

const currentLevelFilterOptionsInRange = computed(() => {
  const { minLevelValue, maxLevelValue } = currentLevelValueRange.value;

  if (currentLevelFilterOptions.value == null) return [];

  const result = currentLevelFilterOptions.value.filter(({ value: levelValue }) => (
    (levelValue >= minLevelValue) && (levelValue <= maxLevelValue)
  ));

  if (result.length === 0) return currentLevelFilterOptions.value;

  return result;
});

const rainbowGradient = (
  new echarts.graphic.LinearGradient(
    ...[0, 0.5],
    ...[1, 0.5],
    ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'].map((e, i, arr) => ({
      offset: i / (arr.length - 1),
      color: e,
    })),
  )
);

// init-options object must not be inlined otherwise vue-echarts will re-init the chart every time!
const initOptions = computed<echarts.EChartsInitOpts>(() => ({
  renderer: 'svg',
}));

const option = computed<echarts.EChartsOption>(() => ({
  grid: {
    top: 10,
    left: 0,
    right: 10,
    bottom: 0,
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    order: 'seriesDesc',
    extraCssText: 'z-index: 200 !important;',
    showContent: !context.$vuetify.breakpoint.mobile,
    axisPointer: { animation: !context.$vuetify.breakpoint.mobile },
  },
  xAxis: {
    type: 'category',
    axisTick: {
      interval: 0,
      alignWithLabel: true,
    },
    axisLabel: {
      showMinLabel: true,
      showMaxLabel: true,
    },
    data: currentLevelFilterOptionsInRange.value.map((level) => level.text),
  },
  yAxis: {
    type: 'value',
  },
  series: [
    ...[
      { difficulty: null, name: '-', color: rainbowGradient },
      ...data.value.difficulties,
    ].map(({ difficulty, name, color }) => ({
      name,
      type: 'bar',
      stack: 'default',
      color,
      data: currentLevelFilterOptionsInRange.value.map((level) => ({
        name: level.text,
        value: sheets.value
          .filter((sheet) => getSheetDifficultyInUse(sheet) === difficulty)
          .filter((sheet) => getSheetLevelValueInUse(sheet) === level.value)
          .length,
        _headerTitle: [
          filters.value.useInternalLevel ? i18n.t('term.internalLevel') : i18n.t('term.level'),
          level.text,
        ].join(' '),
        _getSheets: () => sortedSheets.value
          .filter((sheet) => getSheetLevelValueInUse(sheet) === level.value),
      })),
    } satisfies echarts.BarSeriesOption)),
  ],
}));
</script>

<template>
  <div class="overflow-x-auto">
    <v-chart
      class="SheetDataChart"
      :init-options="initOptions"
      :option="option"
      autoresize
      @click="
        sleep(0).then(() => {
          viewSheetCombo($event.data._getSheets(), { title: $event.data._headerTitle, asDrawPool: true })
        });
        gtag('event', 'SheetComboViewed', { gameCode, eventSource: 'SheetDataChart' });
      "
    />
  </div>
</template>

<style lang="scss" scoped>
.SheetDataChart {
  height: calc(100vh - 200px);
  min-width: 1000px;
}
</style>
