<script setup lang="ts">
import { ref, provide, toRef } from '@nuxtjs/composition-api';
import type { Sheet } from '~/types';

const props = defineProps<{
  sheets: Sheet[];
  displayMode: string;
}>();

const sheetsPerPage = ref(48);
const pageCount = ref(0);
const currentPage = ref(1);
const currentSheets = ref([]);

provide('sheets', toRef(props, 'sheets'));
provide('sheetsPerPage', sheetsPerPage);
provide('pageCount', pageCount);
provide('currentPage', currentPage);
provide('currentSheets', currentSheets);
</script>

<template>
  <div>
    <v-pagination
      v-model="currentPage"
      :length="pageCount"
      :total-visible="15"
      circle
      class="my-4"
    />

    <!--
      The SheetDataGrid needs currentSheets synced back from the SheetDataTable.
      To ensure the SheetDataTable always exists, we use v-show instead of v-if.
    -->
    <SheetDataGrid
      v-show="displayMode === 'grid'"
    />
    <SheetDataTable
      v-show="displayMode === 'table'"
    />

    <v-pagination
      v-model="currentPage"
      :length="pageCount"
      :total-visible="15"
      circle
      class="my-4"
    />
  </div>
</template>
