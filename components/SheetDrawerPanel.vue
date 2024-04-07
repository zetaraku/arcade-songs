<script setup lang="ts">
import { ref, watch, inject, ComputedRef, useContext } from '@nuxtjs/composition-api';
import useGtag from '~/composables/useGtag';
import useGameInfo from '~/composables/useGameInfo';
import useSheetDialog from '~/composables/useSheetDialog';
import useSheetComboDialog from '~/composables/useSheetComboDialog';
import type { Sheet } from '~/types';

const drawingPool: ComputedRef<Sheet[]> = inject('drawingPool')!;

const context = useContext();
const gtag = useGtag();
const { gameCode, themeColor } = useGameInfo();
const {
  setDrawingPool: setSheetDrawingPool,
  startDrawingSheet,
} = useSheetDialog();
const {
  drawSize,
  setDrawingPool: setSheetComboDrawingPool,
  startDrawingSheetCombo,
} = useSheetComboDialog();

const drawModes = ref(['single', 'combo']);
const drawMode = ref('single');
const drawModeIndex = ref(0);

async function drawSheet() {
  if (drawingPool.value.length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(context.i18n.t('description.drawPoolEmpty'));
    return;
  }

  setSheetDrawingPool(drawingPool.value);
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

  setSheetComboDrawingPool(drawingPool.value);
  await startDrawingSheetCombo(() => {
    gtag('event', 'RandomSheetComboDrawn', { gameCode: gameCode.value, eventSource: 'SheetDrawerPanel', drawSize: drawSize.value });
  });
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
