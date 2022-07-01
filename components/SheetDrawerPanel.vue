<script setup lang="ts">
import { ref, watch, inject, Ref, ComputedRef } from '@nuxtjs/composition-api';
import { useI18n } from 'nuxt-i18n-composable';
import useGtag from '~/composables/useGtag';
import useGameInfo from '~/composables/useGameInfo';
import useSheetDialog from '~/composables/useSheetDialog';
import { mod } from '~/utils';
import ItemDrawer from '~/utils/ItemDrawer';
import { Sheet } from '~/types';

const drawMode: Ref<string> = inject('drawMode')!;
const comboDrawer: ItemDrawer<Sheet> = inject('comboDrawer')!;
const drawingPool: ComputedRef<Sheet[]> = inject('drawingPool')!;

const i18n = useI18n();
const gtag = useGtag();
const { gameCode, themeColor } = useGameInfo();
const {
  setDrawingPool,
  startDrawingSheet,
} = useSheetDialog();

const drawModes = ref(['single', 'combo']);
const drawModeIndex = ref(0);

async function drawSheet() {
  if (drawingPool.value.length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(i18n.t('description.drawPoolEmpty'));
    return;
  }

  setDrawingPool(drawingPool.value);
  const isFinished = await startDrawingSheet();

  if (isFinished) {
    gtag('event', 'RandomSongDrawn', { game_code: gameCode.value });
  }
}
async function drawCombo() {
  if (drawingPool.value.length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(i18n.t('description.drawPoolEmpty'));
    return;
  }

  document.getElementById('drawComboAnchor')?.scrollIntoView({
    behavior: 'smooth',
  });

  comboDrawer.setDrawingPool(drawingPool.value);
  const isFinished = await comboDrawer.startDrawing();

  if (isFinished) {
    gtag('event', 'RandomComboDrawn', { game_code: gameCode.value });
  }
}

watch(drawModeIndex, () => {
  drawMode.value = drawModes.value[mod(drawModeIndex.value, drawModes.value.length)];
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
      @click="drawCombo();"
    >
      {{ $t('sfc.SheetDrawerPanel.drawRandomCombo') }}
    </v-btn>
    <v-btn
      v-if="drawModes.length > 1"
      icon
      @click="drawModeIndex += 1;"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>
