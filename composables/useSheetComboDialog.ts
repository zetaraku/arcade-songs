import { ref, computed, watch } from '@nuxtjs/composition-api';
import { useLocalStorage } from '@vueuse/core';
import { NULL_SHEET } from '~/utils';
import type { Sheet } from '~/types';
import useItemDrawer from './useItemDrawer';

const isOpened = ref(false);
const drawingPool = ref<Sheet[]>([]);
const drawSize = useLocalStorage('SheetComboDrawer:drawSize', 4);
const allowDuplicate = useLocalStorage('SheetComboDrawer:allowDuplicate', false);

const isBlindfoldMode = ref(false);
const blindfoldedIndexes = ref(new Set());

const {
  currentItems,
  isDrawing,
  setCurrentItems,
  startDrawing,
  stopDrawing,
} = useItemDrawer<Sheet>({
  drawingPool,
  drawSize,
  allowDuplicate,
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

  if (isBlindfoldMode.value) {
    blindfoldedIndexes.value = new Set([...Array(drawSize.value).keys()]);
  } else {
    blindfoldedIndexes.value = new Set();
  }

  await startDrawing(onFinish);
}

async function stopDrawingSheetCombo() {
  await stopDrawing();
}

// reveal all sheets when the current sheets are reset in useItemDrawer()
watch([drawingPool, drawSize, allowDuplicate], () => {
  blindfoldedIndexes.value = new Set();
});

export default function useSheetComboDialog() {
  return {
    currentSheets,
    isOpened,
    isStatic,
    drawingPool,
    drawSize,
    allowDuplicate,
    viewSheetCombo,
    startDrawingSheetCombo,
    stopDrawingSheetCombo,
    isBlindfoldMode,
    blindfoldedIndexes,
  };
}
