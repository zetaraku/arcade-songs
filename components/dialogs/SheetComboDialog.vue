<script setup lang="ts">
import { computed, watch, inject, Ref } from '@nuxtjs/composition-api';
import useGtag from '~/composables/useGtag';
import useGameInfo from '~/composables/useGameInfo';
import useSheetDialog from '~/composables/useSheetDialog';
import useSheetComboDialog from '~/composables/useSheetComboDialog';
import SheetTile from '~/components/SheetTile.vue';
import { clamp, VOID_SHEET } from '~/utils';

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
  allowDuplicate,
  startDrawingSheetCombo,
  stopDrawingSheetCombo,
  isBlindfoldMode,
  blindfoldedIndexes,
} = useSheetComboDialog();

async function drawSheets() {
  await startDrawingSheetCombo(() => {
    gtag('event', 'RandomSheetComboDrawn', {
      gameCode: gameCode.value,
      eventSource: 'SheetComboDialog',
      drawSize: drawSize.value,
      allowDuplicate: allowDuplicate.value,
      isBlindfoldMode: isBlindfoldMode.value,
    });
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

function handleSheetClick(index: number) {
  if (blindfoldedIndexes.value.has(index)) {
    // reveal sheet
    blindfoldedIndexes.value.delete(index);
    blindfoldedIndexes.value = new Set(blindfoldedIndexes.value);
    gtag('event', 'SheetRevealed', { gameCode, eventSource: 'SheetComboDialog' });
  } else {
    viewSheet(currentSheets.value[index]);
    gtag('event', 'SheetViewed', { gameCode, eventSource: 'SheetComboDialog' });
  }
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
  if (drawSize.value <= 36) return '1000px';
  // 7 per line
  if (drawSize.value <= 49) return '1150px';
  // 8 per line
  if (drawSize.value <= 64) return '1300px';
  // 9 per line
  if (drawSize.value <= 81) return '1450px';
  // 10 per line
  return '1600px';
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
    scrollable
  >
    <v-card>
      <v-card-title class="justify-center">
        {{ $t('sfc.SheetComboDialog.drawResults') }}
      </v-card-title>

      <v-divider class="mx-4" />

      <div class="py-5 overflow-y-auto">
        <div
          class="d-flex flex-wrap justify-center"
          @contextmenu.prevent
        >
          <SheetTile
            v-for="(sheet, i) in currentSheets"
            :key="i"
            :sheet="!blindfoldedIndexes.has(i) ? sheet : VOID_SHEET"
            :hide-cover="!isStatic"
            @click.left="handleSheetClick(i);"
          />
        </div>
      </div>

      <v-divider class="mx-4" />

      <v-card-actions>
        <!-- Draw Count -->
        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              large
              icon
              class="text-h6 pa-0 ma-0"
              @click="configDrawSize();"
              v-on="on"
            >
              <v-icon>mdi-pound-box-outline</v-icon>
            </v-btn>
          </template>
          <span v-text="$t('sfc.SheetComboDialog.changeDrawSize')" />
        </v-tooltip>

        <!-- No Duplicate -->
        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              large
              icon
              class="text-h6 pa-0 ma-0"
              @click="allowDuplicate = !allowDuplicate;"
              v-on="on"
            >
              <v-icon>{{ allowDuplicate ? 'mdi-autorenew' : 'mdi-autorenew-off' }}</v-icon>
            </v-btn>
          </template>
          <span v-text="$t('sfc.SheetComboDialog.allowDuplicate')" />
        </v-tooltip>

        <!-- Blindfold Mode -->
        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              large
              icon
              class="text-h6 pa-0 ma-0"
              @click="isBlindfoldMode = !isBlindfoldMode;"
              v-on="on"
            >
              <v-icon>{{ !isBlindfoldMode ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
            </v-btn>
          </template>
          <span v-text="$t('sfc.SheetComboDialog.blindfoldMode')" />
        </v-tooltip>

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
