import { ref, computed } from '@nuxtjs/composition-api';
import { NULL_SHEET } from '~/utils';
import ItemDrawer from '~/utils/ItemDrawer';
import type { Sheet } from '~/types';

const isOpened = ref(false);

const sheetComboDrawer = new ItemDrawer<Sheet>({ drawSize: 4 });
const currentSheets = computed(
  () => sheetComboDrawer.currentItems.value.map((sheet) => sheet ?? NULL_SHEET),
);
const isStatic = computed(() => !sheetComboDrawer.isDrawing.value);

async function setDrawingPool(sheets: Sheet[]) {
  sheetComboDrawer.setDrawingPool(sheets);
}

async function setDrawSize(drawSize: number) {
  sheetComboDrawer.setDrawSize(drawSize);
}

async function setDrawWithReplacement(drawWithReplacement: boolean) {
  sheetComboDrawer.setDrawWithReplacement(drawWithReplacement);
}

async function startDrawingSheetCombo() {
  isOpened.value = true;
  const isFinished = await sheetComboDrawer.startDrawing();
  return isFinished;
}

async function stopDrawingSheetCombo() {
  sheetComboDrawer.stopDrawing();
}

export default function useSheetComboDialog() {
  return {
    currentSheets,
    isOpened,
    isStatic,
    setDrawingPool,
    setDrawSize,
    setDrawWithReplacement,
    startDrawingSheetCombo,
    stopDrawingSheetCombo,
  };
}
