<script setup lang="ts">
import { ref, computed, watch, inject, Ref } from '@nuxtjs/composition-api';
import copyToClipboard from 'copy-to-clipboard';
import useDataStore from '~/stores/data';
import useGtag from '~/composables/useGtag';
import useGameInfo from '~/composables/useGameInfo';
import useGameData from '~/composables/useGameData';
import useSheetDialog from '~/composables/useSheetDialog';
import cat from '~/assets/cat.png';

const isDarkMode: Ref<boolean> = inject('isDarkMode')!;

const gtag = useGtag();
const dataStore = useDataStore();
const { gameCode } = useGameInfo();
const {
  getTypeIconUrl,
  getDifficultyName,
  getDifficultyColor,
  getDifficultyIconUrl,
  getDifficultyIconHeight,
  getSheetSearchLinkIcon,
  getSheetSearchLinkColor,
  getSheetSearchLink,
} = useGameData();
const {
  currentSheet: sheet,
  isOpened,
  isDrawMode,
  isStatic,
  startDrawingSheet,
  stopDrawingSheet,
} = useSheetDialog();

const imageErrorOccurred = ref(false);
const copyHintOpened = ref(false);

const data = computed(() => dataStore.currentData);
const imageSrc = computed(() => {
  if (imageErrorOccurred.value) return cat;
  return isStatic.value ? sheet.value.imageUrl : undefined;
});

function copyText(text: string | undefined) {
  if (text == null) return;

  copyToClipboard(text, {
    format: 'text/plain',
  });

  copyHintOpened.value = true;
}

async function drawSheet() {
  const isFinished = await startDrawingSheet();

  if (isFinished) {
    gtag('event', 'RandomSheetDrawn', { game_code: gameCode.value });
  }
}

watch(sheet, () => {
  imageErrorOccurred.value = false;
});
watch(isOpened, () => {
  if (!isOpened.value) stopDrawingSheet();
});
</script>

<template>
  <v-dialog
    v-model="isOpened"
    max-width="500px"
    :overlay-color="isDarkMode ? '#FFF8' : undefined"
  >
    <!-- This is explicitly added for the variables used in v-on to be exposed correctly -->
    <template v-if="false">
      {{ imageErrorOccurred }}
    </template>

    <v-card>
      <v-img
        contain
        class="grey lighten-2"
        :class="{ 'rainbow-background': sheet.isSpecial }"
        :height="$vuetify.breakpoint.height < 750 ? '250px' : '350px'"
        :src="imageSrc"
        @error="imageErrorOccurred = true;"
      >
        <!-- invisible image for user to save -->
        <img
          :src="imageSrc"
          style="
            position: absolute;
            height: 100%; width: 100%;
            object-fit: contain;
            opacity: 0;
            vertical-align: middle;"
          :title="sheet.title"
          alt=""
        >

        <div
          v-if="!isStatic"
          class="d-flex justify-center align-center fill-height text-h1 white--text"
        >
          <span v-text="sheet.songNo" />
        </div>
        <div
          v-else
          class="d-flex justify-end align-end fill-height pa-3"
        >
          <v-tooltip v-if="sheet.searchUrl !== null" top>
            <template #activator="{ on }">
              <v-btn
                :fab="$vuetify.breakpoint.xsOnly"
                :text="$vuetify.breakpoint.smAndUp"
                :color="getSheetSearchLinkColor(sheet)"
                :href="getSheetSearchLink(sheet)"
                target="_blank"
                class="white--text"
                v-on="on"
                @click="$gtag('event', 'SheetVideoSearched', { game_code: gameCode });"
              >
                <v-icon
                  :large="$vuetify.breakpoint.smAndUp"
                  v-text="getSheetSearchLinkIcon(sheet)"
                />
              </v-btn>
            </template>
            <span>
              {{ sheet.searchUrl === undefined ? $t('sfc.SheetDialog.searchOnYouTube') : ':3' }}
            </span>
          </v-tooltip>
        </div>

        <img
          v-if="getTypeIconUrl(sheet.type) != null"
          :src="getTypeIconUrl(sheet.type)"
          style="position: absolute; bottom: 10px; left: 15px;"
          alt=""
        >
      </v-img>
      <v-card-text class="py-5">
        <div style="position: relative;">
          <!-- Left column -->
          <div>
            <!-- Category -->
            <h3
              class="text-truncate"
              style="margin-right: 80px;"
            >
              <span>{{ (sheet.category || 'N/A').replaceAll('|', '｜') }}</span>
            </h3>

            <!-- Title -->
            <v-tooltip top>
              <template #activator="{ on }">
                <h1
                  class="py-2 text-truncate"
                  :class="{ 'text--primary': isStatic }"
                  style="cursor: pointer; user-select: all; margin-right: 42px;"
                  v-on="on"
                  @click="copyText(sheet.title);"
                >
                  <span v-text="sheet.title" />
                </h1>
              </template>
              <span v-text="sheet.title" />
            </v-tooltip>

            <!-- Artist -->
            <h4
              class="pb-2 text-truncate"
              style="margin-right: 42px;"
            >
              <span>{{ sheet.artist || 'N/A' }}</span>
            </h4>

            <!-- Difficulty & Level -->
            <h2 class="py-2 text-truncate">
              <img
                v-if="getDifficultyIconUrl(sheet.difficulty) != null"
                :src="getDifficultyIconUrl(sheet.difficulty)"
                :height="getDifficultyIconHeight(sheet.difficulty)"
                class="mr-1"
                alt=""
                style="vertical-align: middle;"
              >
              <span
                :class="{ 'text--primary': getDifficultyColor(sheet.difficulty) === 'unset' }"
                :style="{ 'color': getDifficultyColor(sheet.difficulty) }"
              >{{ getDifficultyName(sheet.difficulty) }} {{ sheet.level }}</span>
              <v-tooltip
                v-if="sheet.internalLevel != null"
                top
              >
                <template #activator="{ on }">
                  <small class="text--secondary" v-on="on">
                    <span>({{ sheet.internalLevel }})</span>
                  </small>
                </template>
                <span v-text="$t('term.internalLevel')" />
              </v-tooltip>
            </h2>

            <!-- Note Designer -->
            <h4 class="pt-2 text-truncate">
              <span v-text="$t('term.noteDesigner')" />:
              <span>{{ sheet.noteDesigner || 'N/A' }}</span>
            </h4>

            <!-- Release Date & Version -->
            <h4 class="pt-2 text-truncate">
              <span v-text="$t('term.releaseDate')" />:
              <span>{{ sheet.releaseDate || '????-??-??' }}</span>
              <span>({{ sheet.version || 'N/A' }})</span>
            </h4>
          </div>

          <!-- Right column -->
          <div
            class="d-flex flex-column justify-start align-end"
            style="position: absolute; top: 0; right: 0;"
          >
            <!-- BPM -->
            <h3 class="mb-2">
              <span v-text="$t('term.bpm')" />
              <span>{{ sheet.bpm != null ? sheet.bpm : '?' }}</span>
            </h3>

            <!-- Unlock needed -->
            <v-tooltip v-if="sheet.isLocked" top>
              <template #activator="{ on }">
                <v-icon large class="pa-1" v-on="on">
                  mdi-lock
                </v-icon>
              </template>
              <span v-text="$t('description.unlockNeeded')" />
            </v-tooltip>

            <!-- Unavailable in regions -->
            <template v-for="({ region, name: regionName }, i) in data.regions">
              <v-tooltip
                v-if="sheet.regions && sheet.regions[region] === false"
                :key="i"
                top
              >
                <template #activator="{ on }">
                  <v-icon large class="pa-1" v-on="on">
                    {{ region === 'jp' ? 'mdi-circle-off-outline' : '' }}
                    {{ region === 'intl' ? 'mdi-earth-off' : '' }}
                    {{ region === 'cn' ? 'mdi-earth-box-off' : '' }}
                  </v-icon>
                </template>
                <span>
                  {{ $t('description.unavailableInRegion', { region: regionName }) }}
                </span>
              </v-tooltip>
            </template>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="isDrawMode"
          text
          color="primary"
          @click="drawSheet();"
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

    <v-snackbar v-model="copyHintOpened" :timeout="750">
      <v-icon left color="success">
        mdi-content-copy
      </v-icon>
      <span v-text="$t('description.copied')" />
    </v-snackbar>
  </v-dialog>
</template>
