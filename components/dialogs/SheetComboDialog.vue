<script setup lang="ts">
import { computed, watch, useContext } from '@nuxtjs/composition-api';
import useGtag from '~/composables/useGtag';
import useDarkMode from '~/composables/useDarkMode';
import useGameInfo from '~/composables/useGameInfo';
import useSheetDialog from '~/composables/useSheetDialog';
import useSheetComboDialog from '~/composables/useSheetComboDialog';
import SheetTile from '~/components/SheetTile.vue';
import { clamp, VOID_SHEET } from '~/utils';

const context = useContext();

const gtag = useGtag();
const { isDarkMode } = useDarkMode();
const { gameCode } = useGameInfo();
const {
  viewSheet,
} = useSheetDialog();
const {
  currentSheets,
  isOpened,
  isDrawMode,
  isStatic,
  isShowAll,
  headerTitle,
  drawSize,
  allowDuplicate,
  startDrawingSheetCombo,
  stopDrawingSheetCombo,
  isBlindfoldMode,
  blindfoldedIndexes,
} = useSheetComboDialog();
const {
  drawingPool: sheetDrawingPool,
  startDrawingSheet,
} = useSheetDialog();

const displayingSheets = computed(() => (
  isShowAll.value
    ? currentSheets.value
    : currentSheets.value.slice(0, 100)
));

async function drawSheet() {
  if (currentSheets.value.length === 0) {
    // eslint-disable-next-line no-alert
    window.alert(context.i18n.t('description.drawPoolEmpty'));
    return;
  }

  sheetDrawingPool.value = currentSheets.value;
  await startDrawingSheet(() => {
    gtag('event', 'RandomSheetDrawn', {
      gameCode: gameCode.value,
      eventSource: 'SheetComboDialog',
    });
  });
}

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
    gtag('event', 'SheetRevealed', { gameCode: gameCode.value, eventSource: 'SheetComboDialog' });
  } else {
    viewSheet(currentSheets.value[index]);
    gtag('event', 'SheetViewed', { gameCode: gameCode.value, eventSource: 'SheetComboDialog' });
  }
}

const maxDialogWidth = computed(() => {
  const displayCount = displayingSheets.value.length;

  // 2 per line
  if (displayCount <= 4) return 400;
  // 3 per line
  if (displayCount <= 9) return 550;
  // 4 per line
  if (displayCount <= 16) return 700;
  // 5 per line
  if (displayCount <= 25) return 850;
  // 6 per line
  if (displayCount <= 36) return 1000;
  // 7 per line
  if (displayCount <= 49) return 1150;
  // 8 per line
  if (displayCount <= 64) return 1300;
  // 9 per line
  if (displayCount <= 81) return 1450;
  // 10 per line
  return 1600;
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
      <v-card-title class="justify-center text-center">
        <template v-if="isDrawMode">
          {{ $t('sfc.SheetComboDialog.drawResults') }}
        </template>
        <template v-else>
          {{ headerTitle }}
          <br>
          ({{ $t('sfc.FilterInfoBar.sheetsCount', { n: currentSheets.length }) }})
        </template>
      </v-card-title>

      <v-divider class="mx-4" />

      <div class="py-5 overflow-y-auto" style="overscroll-behavior: contain;">
        <div
          class="d-flex flex-wrap justify-center"
          style="gap: 8px;"
          @contextmenu.prevent
        >
          <SheetTile
            v-for="(sheet, i) in displayingSheets"
            :key="i"
            :sheet="!blindfoldedIndexes.has(i) ? sheet : VOID_SHEET"
            :hide-cover="!isStatic"
            @click.left="handleSheetClick(i);"
          />
        </div>
        <div class="d-flex justify-center py-4">
          <v-btn
            v-if="displayingSheets.length < currentSheets.length"
            color="info"
            outlined
            @click="isShowAll = true;"
          >
            {{ $t('ui.showAll') }}
          </v-btn>
        </div>
      </div>

      <v-divider class="mx-4" />

      <v-card-actions>
        <template v-if="isDrawMode">
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
        </template>
        <template v-else>
          <v-btn
            text
            color="primary"
            @click="drawSheet();"
          >
            {{ $t('sfc.SheetDrawerPanel.drawRandomSheet') }}
          </v-btn>
        </template>

        <v-spacer />

        <v-btn
          v-if="isDrawMode"
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
          {{ isDrawMode ? $t('ui.ok') : $t('ui.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
