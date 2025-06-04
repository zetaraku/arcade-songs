<script setup lang="ts">
import { inject, Ref } from '@nuxtjs/composition-api';
import useGameInfo from '~/composables/useGameInfo';
import useSheetDialog from '~/composables/useSheetDialog';
import useSheetHeaders from '~/composables/useSheetHeaders';
import useSelectedSheets from '~/composables/useSelectedSheets';
import SheetTile from '~/components/SheetTile.vue';
import { getCanonicalSheet } from '~/utils';
import type { Sheet } from '~/types';

const filterMode: Ref<string> = inject('filterMode')!;

const currentSheets: Ref<Sheet[]> = inject('currentSheets')!;
const sortBy: Ref<string> = inject('sortBy')!;
const sortDesc: Ref<boolean> = inject('sortDesc')!;

const { gameCode } = useGameInfo();
const { viewSheet } = useSheetDialog();
const headers = useSheetHeaders();
const { selectedSheets, toggleSheetSelection } = useSelectedSheets();

function getItemClass(sheet: Sheet) {
  return filterMode.value !== 'my-list' && selectedSheets.value.includes(getCanonicalSheet(sheet)) ? 'selected-sheet' : '';
}
</script>

<template>
  <div>
    <!-- This is explicitly added for the variables used in v-on to be exposed correctly -->
    <template v-if="false">
      {{ sortDesc }}
    </template>
    <v-select
      v-model="sortBy"
      :items="headers"
      :label="$vuetify.lang.t('$vuetify.dataTable.sortBy')"
      :placeholder="$t('ui.default')"
      persistent-placeholder
      clearable
      hide-details
      class="d-flex align-center mx-auto my-5"
      style="width: 500px;"
    >
      <template #append-outer>
        <v-btn
          text
          @click="sortDesc = !sortDesc;"
        >
          <v-icon left>
            {{ !sortDesc ? 'mdi-sort-reverse-variant' : 'mdi-sort-variant' }}
          </v-icon>
          <span>
            {{ !sortDesc ? $t('ui.sort-asc') : $t('ui.sort-desc') }}
          </span>
        </v-btn>
      </template>
    </v-select>
    <div
      class="d-flex flex-wrap justify-center"
      @contextmenu.prevent
    >
      <SheetTile
        v-for="(sheet, i) in currentSheets"
        :key="i"
        :sheet="sheet"
        :class="getItemClass(sheet)"
        @click.left="
          viewSheet(sheet);
          $gtag('event', 'SheetViewed', { gameCode, eventSource: 'SheetDataGrid' });
        "
        @click.right="toggleSheetSelection(getCanonicalSheet(sheet));"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
::v-deep {
  .selected-sheet {
    background-color: #4eda !important;
  }
}
</style>
