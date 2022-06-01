<script setup lang="ts">
import { inject, Ref } from '@nuxtjs/composition-api';
import useSheetDialog from '~/composables/useSheetDialog';
import type { Sheet } from '~/types';

const selectedSheets: Ref<Sheet[]> = inject('selectedSheets')!;
const currentSheets: Ref<Sheet[]> = inject('currentSheets')!;

const { viewSheet } = useSheetDialog();

function toggleSheetSelection(sheet: Sheet) {
  const index = selectedSheets.value.indexOf(sheet);
  if (index === -1) {
    selectedSheets.value.push(sheet);
  } else {
    selectedSheets.value.splice(index, 1);
  }
}
</script>

<template>
  <div>
    <div
      class="d-flex flex-wrap justify-center"
      @contextmenu.prevent
    >
      <SheetTile
        v-for="(sheet, i) in currentSheets"
        :key="i"
        :sheet="sheet"
        :class="{ 'selected-sheet': selectedSheets.includes(sheet) }"
        @click.left="viewSheet(sheet);"
        @click.right="toggleSheetSelection(sheet);"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
::v-deep {
  .selected-sheet {
    background-color: #4EDA !important;
  }
}
</style>
