import { computed } from '@nuxtjs/composition-api';
import { useDataStore } from '~/stores/data';
import { isCanonicalSheet } from '~/utils';
import type { Sheet } from '~/types';

export default function useSelectedSheets() {
  const dataStore = useDataStore();

  const selectedSheets = computed({
    get() {
      return dataStore.currentSelectedSheets;
    },
    set(value) {
      dataStore.currentSelectedSheets = value;
    },
  });

  function toggleSheetSelection(sheet: Sheet) {
    if (!isCanonicalSheet(sheet)) {
      // eslint-disable-next-line no-console
      console.warn('Non-canonical sheet should not be used as selected sheets.');
    }

    const newSelectedSheets = selectedSheets.value.slice();

    const index = newSelectedSheets.indexOf(sheet);
    if (index === -1) {
      newSelectedSheets.push(sheet);
    } else {
      newSelectedSheets.splice(index, 1);
    }

    dataStore.currentSelectedSheets = newSelectedSheets;
  }

  return {
    selectedSheets,
    toggleSheetSelection,
  };
}
