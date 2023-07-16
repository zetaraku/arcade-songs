<script setup lang="ts">
import { computed, inject, Ref } from '@nuxtjs/composition-api';
import YAML from 'yaml';
import FileSaver from 'file-saver';
import useGtag from '~/composables/useGtag';
import useGameInfo from '~/composables/useGameInfo';
import { computeSheetExpr, toLocalISODateString } from '~/utils';
import type { Sheet } from '~/types';

defineProps<{
  value: boolean;
}>();
defineEmits<{
  (event: 'input', value: boolean): void;
}>();

const isDarkMode: Ref<boolean> = inject('isDarkMode')!;
const selectedSheets: Ref<Sheet[]> = inject('selectedSheets')!;

const gtag = useGtag();
const { gameCode } = useGameInfo();

const selectedSheetsYaml = computed(
  () => YAML.stringify(selectedSheets.value.map((sheet) => computeSheetExpr(sheet))),
);

async function exportSelectedSheets() {
  try {
    FileSaver.saveAs(
      new Blob([selectedSheetsYaml.value], { type: 'application/yaml; charset=utf-8;' }),
      `${gameCode.value}-mylist-${toLocalISODateString(new Date()).replaceAll('-', '')}.yaml`,
    );

    gtag('event', 'MyListExported', { gameCode: gameCode.value, eventSource: 'MyListExportDialog' });
  } catch (e) {
    // eslint-disable-next-line no-alert
    window.alert(`An error occurred while saving MY LIST:\n${e}`);
  }
}
</script>

<template>
  <v-dialog
    :value="value"
    max-width="600px"
    scrollable
    :overlay-color="isDarkMode ? '#FFF8' : undefined"
    @input="$emit('input', $event);"
  >
    <v-card>
      <v-card-title>
        <v-icon left>
          mdi-download
        </v-icon>
        {{ $t('sfc.ModeSelector.exportMyList') }}
      </v-card-title>
      <v-card-text>
        <v-textarea
          :label="`${$t('ui.preview')} (YAML)`"
          :value="selectedSheetsYaml"
          outlined
          readonly
          auto-grow
          hide-details
          class="mt-2"
          style="font-family: monospace;"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="exportSelectedSheets"
        >
          {{ $t('ui.download') }}
        </v-btn>
        <v-btn
          text
          color="success"
          @click="$emit('input', false);"
        >
          {{ $t('ui.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
