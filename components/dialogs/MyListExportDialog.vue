<script setup lang="ts">
import { computed } from '@nuxtjs/composition-api';
import YAML from 'yaml';
import FileSaver from 'file-saver';
import useGtag from '~/composables/useGtag';
import useSentry from '~/composables/useSentry';
import useDarkMode from '~/composables/useDarkMode';
import useGameInfo from '~/composables/useGameInfo';
import useSelectedSheets from '~/composables/useSelectedSheets';
import { toLocalISODateString } from '~/utils';

defineProps<{
  value: boolean;
}>();
// eslint-disable-next-line no-spaced-func, func-call-spacing
defineEmits<{
  (event: 'input', value: boolean): void;
}>();

const gtag = useGtag();
const sentry = useSentry();
const { isDarkMode } = useDarkMode();
const { gameCode } = useGameInfo();
const { selectedSheets } = useSelectedSheets();

const selectedSheetsYaml = computed(
  () => YAML.stringify(
    selectedSheets.value.map((sheet) => sheet.sheetExpr ?? null),
  ),
);

async function exportSelectedSheets() {
  try {
    FileSaver.saveAs(
      new Blob([selectedSheetsYaml.value], { type: 'application/yaml; charset=utf-8;' }),
      `${gameCode.value}-mylist-${toLocalISODateString(new Date()).replaceAll('-', '')}.yaml`,
    );

    gtag('event', 'MyListExported', { gameCode: gameCode.value, eventSource: 'MyListExportDialog' });
  } catch (err) {
    sentry.captureException(err);

    // eslint-disable-next-line no-alert
    window.alert(`An error occurred while saving MY LIST:\n${err}`);
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
          style="font-family: Consolas, monospace;"
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
