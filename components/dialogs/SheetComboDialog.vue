<script setup lang="ts">
import { computed, watch, inject, Ref } from '@nuxtjs/composition-api';
import useGtag from '~/composables/useGtag';
import useGameInfo from '~/composables/useGameInfo';
import useSheetDialog from '~/composables/useSheetDialog';
import useSheetComboDialog from '~/composables/useSheetComboDialog';
import SheetTile from '~/components/SheetTile.vue';
import { clamp } from '~/utils';

const isDarkMode: Ref<boolean> = inject('isDarkMode')!;

const gtag = useGtag();
const { gameCode } = useGameInfo();
const {
  viewSheet,
} = useSheetDialog();
const {
  currentSheets,
  isOpened,
  isStatic,
  drawSize,
  drawWithReplacement,
  startDrawingSheetCombo,
  stopDrawingSheetCombo,
} = useSheetComboDialog();

async function drawSheets() {
  await startDrawingSheetCombo(() => {
    gtag('event', 'RandomSheetComboDrawn', { gameCode: gameCode.value, eventSource: 'SheetComboDialog', drawSize: drawSize.value });
  });
}

function configDrawSize() {
  // eslint-disable-next-line no-alert
  const userInput = window.prompt('Input draw size (1~100):', String(drawSize.value));

  if (userInput === null) return;

  const newDrawSize = Number(userInput);

  if (!Number.isInteger(newDrawSize)) {
    // eslint-disable-next-line no-alert
    window.alert('Invalid draw size.');
    return;
  }

  drawSize.value = clamp(newDrawSize, 1, 100);
}

const maxDialogWidth = computed(() => {
  // 2 per line
  if (drawSize.value <= 4) return '400px';
  // 3 per line
  if (drawSize.value <= 9) return '550px';
  // 4 per line
  if (drawSize.value <= 16) return '700px';
  // 5 per line
  if (drawSize.value <= 25) return '850px';
  // 6 per line
  return '1000px';
});

watch(isOpened, () => {
  if (!isOpened.value) stopDrawingSheetCombo();
});
</script>

<template>
  <v-dialog
    v-model="isOpened"
    :max-width="maxDialogWidth"
    :overlay-color="isDarkMode ? '#FFF8' : undefined"
  >
    <v-card>
      <v-card-title class="justify-center">
        {{ $t('sfc.SheetComboDialog.drawResults') }}
      </v-card-title>

      <v-divider class="mx-4" />

      <div class="py-5">
        <div
          class="d-flex flex-wrap justify-center"
          @contextmenu.prevent
        >
          <SheetTile
            v-for="(sheet, i) in currentSheets"
            :key="i"
            :sheet="sheet"
            :hide-cover="!isStatic"
            @click.left="
              viewSheet(sheet);
              $gtag('event', 'SheetViewed', { gameCode, eventSource: 'SheetComboDialog' });
            "
          />
        </div>
      </div>

      <v-divider class="mx-4" />

      <v-card-actions>
        <v-btn
          large
          icon
          class="text-h6"
          @click="configDrawSize();"
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
        <v-checkbox
          v-model="drawWithReplacement"
          :label="$t('sfc.SheetComboDialog.noDuplicate')"
          hide-details
          class="pt-0 my-4 ml-3"
        />

        <v-spacer />

        <v-btn
          text
          color="primary"
          @click="drawSheets();"
        >
          {{ $t('sfc.SheetDialog.tryAgain') }}
        </v-btn>
        <v-btn
          text
          color="success"
          @click="isOpened = false;"
        >
          {{ $t('ui.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
