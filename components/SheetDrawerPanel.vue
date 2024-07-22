<script setup lang="ts">
import { ref, watch, inject, Ref, ComputedRef, useContext } from '@nuxtjs/composition-api';
import confetti from 'canvas-confetti';
import sleep from 'sleep-promise';
import useGtag from '~/composables/useGtag';
import useGameInfo from '~/composables/useGameInfo';
import useSheetDialog from '~/composables/useSheetDialog';
import useSheetComboDialog from '~/composables/useSheetComboDialog';
import { INDI_SHEET, pickItem } from '~/utils';
import type { Sheet } from '~/types';

const isDarkMode: Ref<boolean> = inject('isDarkMode')!;
const drawingPool: ComputedRef<Sheet[]> = inject('drawingPool')!;

const context = useContext();
const gtag = useGtag();
const { gameCode, themeColor } = useGameInfo();
const {
  drawingPool: sheetDrawingPool,
  startDrawingSheet,
  viewSheet,
} = useSheetDialog();
const {
  drawingPool: sheetComboDrawingPool,
  drawSize,
  startDrawingSheetCombo,
} = useSheetComboDialog();

const drawModes = ref(['light', 'single', 'combo']);
const drawMode = ref('single');
const drawModeIndex = ref(1);

async function drawSheet() {
  if (drawingPool.value.length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(context.i18n.t('description.drawPoolEmpty'));
    return;
  }

  sheetDrawingPool.value = drawingPool.value;
  await startDrawingSheet(() => {
    gtag('event', 'RandomSheetDrawn', { gameCode: gameCode.value, eventSource: 'SheetDrawerPanel' });
  });
}
async function drawSheetCombo() {
  if (drawingPool.value.length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(context.i18n.t('description.drawPoolEmpty'));
    return;
  }

  sheetComboDrawingPool.value = drawingPool.value;
  await startDrawingSheetCombo(() => {
    gtag('event', 'RandomSheetComboDrawn', { gameCode: gameCode.value, eventSource: 'SheetDrawerPanel', drawSize: drawSize.value });
  });
}

const lights = ref(
  isDarkMode.value ? [false, false, false, false, false] : pickItem([
    [false, true, false, true, false],
    [true, false, false, false, true],
    [true, false, true, false, true],
    // all configurations are 3 click away to the darkness
  ]),
);

function toggleLight(index: number) {
  lights.value.splice(index, 1, !lights.value[index]);
}

async function toggleLights(index: number) {
  if (index > 0) toggleLight(index - 1);
  toggleLight(index);
  if (index < lights.value.length - 1) toggleLight(index + 1);

  isDarkMode.value = !lights.value.includes(true);

  if (isDarkMode.value) {
    await sleep(1000);
    viewSheet(INDI_SHEET);
    confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 }, zIndex: 999 });
    gtag('event', 'SecretFound', { gameCode: gameCode.value, eventSource: 'SheetDrawerPanel', no: 2 });
  }
}

watch(drawModeIndex, () => {
  drawMode.value = drawModes.value[drawModeIndex.value];
});
</script>

<template>
  <div class="d-flex justify-center align-center">
    <!-- This is explicitly added for the variables used in v-on to be exposed correctly -->
    <template v-if="false">
      {{ drawModeIndex }}
    </template>

    <v-btn
      v-if="drawModes.length > 1"
      icon
      :class="{ 'v-btn--disabled pointer-events-auto': drawModeIndex === 1 }"
      :disabled="drawModeIndex === 0"
      @click="drawModeIndex -= 1;"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <v-btn-toggle
      v-if="drawMode === 'light'"
      class="ma-3"
    >
      <v-btn
        v-for="(light, i) in lights"
        :key="i"
        large
        :color="light ? '#FFA31A' : 'black'"
        class="text-h6 white--text"
        style="min-width: 64px;"
        @click="toggleLights(i);"
      >
        {{ light ? '💡' : '🕯' }}
      </v-btn>
    </v-btn-toggle>
    <v-btn
      v-if="drawMode === 'single'"
      large
      :color="themeColor"
      class="text-h6 ma-3 white--text"
      @click="drawSheet();"
    >
      {{ $t('sfc.SheetDrawerPanel.drawRandomSheet') }}
    </v-btn>
    <v-btn
      v-else-if="drawMode === 'combo'"
      large
      color="success"
      class="text-h6 ma-3"
      @click="drawSheetCombo();"
    >
      {{ $t('sfc.SheetDrawerPanel.drawRandomSheetCombo') }}
    </v-btn>

    <v-btn
      v-if="drawModes.length > 1"
      icon
      :disabled="drawModeIndex === drawModes.length - 1"
      @click="drawModeIndex += 1;"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>

    <link v-if="drawMode === 'light'" rel="preload" :href="INDI_SHEET.imageUrl" as="image">
  </div>
</template>

<style scoped>
.pointer-events-auto {
  pointer-events: auto;
}
</style>
