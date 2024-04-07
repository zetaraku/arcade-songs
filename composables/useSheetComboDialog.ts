import { ref, computed } from '@nuxtjs/composition-api';
import { useLocalStorage } from '@vueuse/core';
import { NULL_SHEET } from '~/utils';
import type { Sheet } from '~/types';
import useItemDrawer from './useItemDrawer';

const isOpened = ref(false);
const drawingPool = ref<Sheet[]>([]);
const drawSize = useLocalStorage('SheetComboDrawer:drawSize', 4);
const drawWithReplacement = useLocalStorage('SheetComboDrawer:drawWithReplacement', true);

const {
  currentItems,
  isDrawing,
  setCurrentItems,
  startDrawing,
  stopDrawing,
} = useItemDrawer<Sheet>({
  drawingPool,
  drawSize,
  drawWithReplacement,
});

const currentSheets = computed(
  () => currentItems.value.map((sheet) => sheet ?? NULL_SHEET),
);
const isStatic = computed(() => !isDrawing.value);

function viewSheetCombo(sheets: Sheet[]) {
  setCurrentItems(sheets);
  isOpened.value = true;
}

async function startDrawingSheetCombo(onFinish?: (resultItems: typeof currentItems.value) => void) {
  isOpened.value = true;
  await startDrawing(onFinish);
}

async function stopDrawingSheetCombo() {
  await stopDrawing();
}

export default function useSheetComboDialog() {
  return {
    currentSheets,
    isOpened,
    isStatic,
    drawingPool,
    drawSize,
    drawWithReplacement,
    viewSheetCombo,
    startDrawingSheetCombo,
    stopDrawingSheetCombo,
  };
}
