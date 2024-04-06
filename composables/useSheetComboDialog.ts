import { ref, computed, readonly } from '@nuxtjs/composition-api';
import { NULL_SHEET } from '~/utils';
import type { Sheet } from '~/types';
import useItemDrawer from './useItemDrawer';

const isOpened = ref(false);
const drawingPool = ref<Sheet[]>([]);
const drawSize = ref(4);
const drawWithReplacement = ref(false);

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

function setDrawingPool(sheets: Sheet[]) {
  drawingPool.value = sheets;
}

function setDrawSize(_drawSize: number) {
  drawSize.value = _drawSize;
}

function setDrawWithReplacement(_drawWithReplacement: boolean) {
  drawWithReplacement.value = _drawWithReplacement;
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
    drawSize: readonly(drawSize),
    viewSheetCombo,
    setDrawingPool,
    setDrawSize,
    setDrawWithReplacement,
    startDrawingSheetCombo,
    stopDrawingSheetCombo,
  };
}
