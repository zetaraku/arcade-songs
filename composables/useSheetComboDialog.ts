import { ref, computed, watch } from '@nuxtjs/composition-api';
import { useLocalStorage } from '@vueuse/core';
import { NULL_SHEET } from '~/utils';
import type { Sheet } from '~/types';
import useItemDrawer from './useItemDrawer';

const isOpened = ref(false);
const isDrawMode = ref(false);
const isShowAll = ref(true);
const headerTitle = ref<string | null>(null);
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

function viewSheetCombo(sheets: Sheet[], title?: string) {
  setCurrentItems(sheets);
  headerTitle.value = title ?? null;
  isDrawMode.value = false;
  isShowAll.value = false;
  isOpened.value = true;
}

async function startDrawingSheetCombo(onFinish?: (resultItems: typeof currentItems.value) => void) {
  headerTitle.value = null;
  isDrawMode.value = true;
  isShowAll.value = true;
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
    isDrawMode,
    isStatic,
    isShowAll,
    headerTitle,
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
