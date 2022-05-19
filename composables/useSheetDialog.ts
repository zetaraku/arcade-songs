import { ref, computed } from '@nuxtjs/composition-api';
import { NULL_SHEET } from '~/utils';
import ItemDrawer from '~/utils/ItemDrawer';
import type { Sheet } from '~/types';

const isDrawMode = ref(false);
const isOpened = ref(false);

const sheetDrawer = new ItemDrawer<Sheet>();
const currentSheet = computed(() => sheetDrawer.currentItems.value[0] ?? NULL_SHEET);
const isStatic = computed(() => !sheetDrawer.isDrawing.value);

function viewSheet(sheet: Sheet) {
  sheetDrawer.setCurrentItems([sheet]);
  isDrawMode.value = false;
  isOpened.value = true;
}

async function setDrawingPool(sheets: Sheet[]) {
  sheetDrawer.setDrawingPool(sheets);
}

async function startDrawingSheet() {
  isDrawMode.value = true;
  isOpened.value = true;
  const isFinished = await sheetDrawer.startDrawing();
  return isFinished;
}

async function stopDrawingSheet() {
  sheetDrawer.stopDrawing();
}

export default function useSheetDialog() {
  return {
    currentSheet,
    isOpened,
    isDrawMode,
    isStatic,
    viewSheet,
    setDrawingPool,
    startDrawingSheet,
    stopDrawingSheet,
  };
}
