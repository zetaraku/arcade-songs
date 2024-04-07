import { ref, computed } from '@nuxtjs/composition-api';
import { NULL_SHEET } from '~/utils';
import type { Sheet } from '~/types';
import useItemDrawer from './useItemDrawer';

const isOpened = ref(false);
const isDrawMode = ref(false);
const drawingPool = ref<Sheet[]>([]);

const {
  currentItems,
  isDrawing,
  setCurrentItems,
  startDrawing,
  stopDrawing,
} = useItemDrawer<Sheet>({
  drawingPool,
  drawSize: 1,
});

const currentSheet = computed(() => currentItems.value[0] ?? NULL_SHEET);
const isStatic = computed(() => !isDrawing.value);

function viewSheet(sheet: Sheet) {
  setCurrentItems([sheet]);
  isDrawMode.value = false;
  isOpened.value = true;
}

async function startDrawingSheet(onFinish?: (resultItems: typeof currentItems.value) => void) {
  isDrawMode.value = true;
  isOpened.value = true;
  await startDrawing(onFinish);
}

async function stopDrawingSheet() {
  await stopDrawing();
}

export default function useSheetDialog() {
  return {
    currentSheet,
    isOpened,
    isDrawMode,
    isStatic,
    drawingPool,
    viewSheet,
    startDrawingSheet,
    stopDrawingSheet,
  };
}
