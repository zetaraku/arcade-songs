<script setup lang="ts">
import { ref, watch, inject, Ref, ComputedRef } from '@nuxtjs/composition-api';
import confetti from 'canvas-confetti';
import useVM from '~/composables/useVM';
import useGameInfo from '~/composables/useGameInfo';
import useSheetDialog from '~/composables/useSheetDialog';
import { mod, RICK_SHEET } from '~/utils';
import ItemDrawer from '~/utils/ItemDrawer';
import { Sheet } from '~/types';

const props = defineProps<{
  sheets: Sheet[];
}>();

const drawMode: Ref<string> = inject('drawMode')!;
const isDarkMode: Ref<boolean> = inject('isDarkMode')!;
const comboDrawer: ItemDrawer<Sheet> = inject('comboDrawer')!;
const drawingPool: ComputedRef<Sheet[]> = inject('drawingPool')!;

const vm = useVM();
const { gameCode, themeColor } = useGameInfo();
const {
  viewSheet,
  setDrawingPool,
  startDrawingSheet,
} = useSheetDialog();

const drawModes = ref(['single', 'combo']);
const drawModeIndex = ref(0);

async function drawSheet() {
  setDrawingPool(props.sheets);
  const isFinished = await startDrawingSheet();

  if (isFinished) {
    (vm as any).$gtag('event', 'RandomSongDrawn', { game_code: gameCode.value });
  }
}
async function drawCombo() {
  if (drawingPool.value.length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(vm.$t('sfc.SheetDrawerPanel.drawPoolEmpty'));
    return;
  }

  document.getElementById('drawComboAnchor')?.scrollIntoView({
    behavior: 'smooth',
  });

  comboDrawer.setDrawingPool(drawingPool.value);
  const isFinished = await comboDrawer.startDrawing();

  if (isFinished) {
    (vm as any).$gtag('event', 'RandomComboDrawn', { game_code: gameCode.value });
  }
}
async function toggleLightSwitch() {
  isDarkMode.value = !isDarkMode.value;
  viewSheet(RICK_SHEET);
  confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 }, zIndex: 999 });

  if (isDarkMode.value) {
    (vm as any).$gtag('event', 'SecretFound', { game_code: gameCode.value, no: 1 });
  }
}

watch(drawModeIndex, () => {
  drawMode.value = drawModes.value[mod(drawModeIndex.value, drawModes.value.length)];

  if (drawModeIndex.value === -7) {
    drawMode.value = 'secret';
  }
});
</script>

<template>
  <div class="d-flex justify-center align-center">
    <!-- This is explicitly added for the variables used in v-on to be exposed correctly -->
    <template v-if="false">
      {{ isDarkMode }}
      {{ drawModeIndex }}
    </template>

    <v-btn
      v-if="drawModes.length > 1"
      icon
      @click.stop="drawModeIndex -= 1;"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-btn
      v-if="drawMode === 'single'"
      large
      dark
      :color="themeColor"
      class="text-h6 ma-3"
      @click.stop="drawSheet();"
    >
      {{ $t('sfc.SheetDrawerPanel.drawRandomSheet') }}
    </v-btn>
    <v-btn
      v-else-if="drawMode === 'combo'"
      large
      color="success"
      class="text-h6 ma-3"
      @click.stop="drawCombo();"
    >
      {{ $t('sfc.SheetDrawerPanel.drawRandomCombo') }}
    </v-btn>
    <v-btn
      v-else-if="drawMode === 'secret'"
      large
      color="warning"
      class="text-h6 ma-3"
      @click.stop="toggleLightSwitch();"
    >
      {{ $t('sfc.SheetDrawerPanel.toggleDarkMode') }}
    </v-btn>
    <v-btn
      v-if="drawModes.length > 1"
      icon
      @click.stop="drawModeIndex += 1;"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>
