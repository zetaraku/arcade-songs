<script setup lang="ts">
import { ref, watch, inject, ComputedRef } from '@nuxtjs/composition-api';
import { useI18n } from 'nuxt-i18n-composable';
import useGtag from '~/composables/useGtag';
import useGameInfo from '~/composables/useGameInfo';
import useSheetDialog from '~/composables/useSheetDialog';
import useSheetComboDialog from '~/composables/useSheetComboDialog';
import type { Sheet } from '~/types';

const drawingPool: ComputedRef<Sheet[]> = inject('drawingPool')!;

const i18n = useI18n();
const gtag = useGtag();
const { gameCode, themeColor } = useGameInfo();
const {
  setDrawingPool: setSheetDrawingPool,
  startDrawingSheet,
} = useSheetDialog();
const {
  setDrawingPool: setSheetComboDrawingPool,
  startDrawingSheetCombo,
} = useSheetComboDialog();

const drawModes = ref(['single', 'combo']);
const drawMode = ref('single');
const drawModeIndex = ref(0);

async function drawSheet() {
  if (drawingPool.value.length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(i18n.t('description.drawPoolEmpty'));
    return;
  }

  setSheetDrawingPool(drawingPool.value);
  const isFinished = await startDrawingSheet();

  if (isFinished) {
    gtag('event', 'RandomSheetDrawn', { gameCode: gameCode.value, eventSource: 'SheetDrawerPanel' });
  }
}
async function drawSheetCombo() {
  if (drawingPool.value.length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(i18n.t('description.drawPoolEmpty'));
    return;
  }

  setSheetComboDrawingPool(drawingPool.value);
  const isFinished = await startDrawingSheetCombo();

  if (isFinished) {
    gtag('event', 'RandomSheetComboDrawn', { gameCode: gameCode.value, eventSource: 'SheetDrawerPanel' });
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
      :disabled="drawModeIndex === 0"
      @click="drawModeIndex -= 1;"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
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
  </div>
</template>
