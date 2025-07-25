<script setup lang="ts">
import { computed, inject, Ref } from '@nuxtjs/composition-api';
import useDarkMode from '~/composables/useDarkMode';
import useGameInfo from '~/composables/useGameInfo';
import useGameData from '~/composables/useGameData';
import useSelectedSheets from '~/composables/useSelectedSheets';
import { getCanonicalSheet } from '~/utils';
import type { Sheet } from '~/types';

const filterMode: Ref<string> | undefined = inject('filterMode');

const props = withDefaults(defineProps<{
  sheet: Sheet,
  hideTitle?: boolean,
  hideCover?: boolean,
  hideLevel?: boolean,
  hideLock?: boolean,
}>(), {
  hideTitle: false,
  hideCover: false,
  hideLevel: false,
  hideLock: false,
});

const { isDarkMode } = useDarkMode();
const { coverImageSize } = useGameInfo();
const {
  getLockedIconUrl,
  getLockedIconHeight,
  getTypeIconUrl,
  getTypeIconHeight,
  getDifficultyName,
  getDifficultyColor,
  getDifficultyIconUrl,
  getDifficultyIconHeight,
} = useGameData();
const {
  selectedSheets,
  toggleSheetSelection,
} = useSelectedSheets();

const isSheetSelected = computed(
  () => selectedSheets.value.includes(getCanonicalSheet(props.sheet)),
);
</script>

<template>
  <div
    v-ripple
    class="SheetTile rounded pa-3"
    :class="filterMode !== 'my-list' && isSheetSelected ? 'selected-sheet' : ''"
    style="user-select: none;"
    @click.right="toggleSheetSelection(getCanonicalSheet(sheet));"
  >
    <v-tooltip
      top
      :nudge-bottom="46 + coverImageSize.height / 2"
      :disabled="$vuetify.breakpoint.mobile || hideTitle"
    >
      <template #activator="{ on }">
        <!-- invisible blocking panel (prevent long-press and right-click on images) -->
        <div
          class="BlockingPanel"
          v-on="{ ...on, ...$listeners }"
          @dragstart.prevent
          @contextmenu.prevent
        />

        <!-- cover image & icons -->
        <div
          class="CoverBackground pa-2"
          :class="{ 'rainbow-background': sheet.isSpecial }"
          v-on="on"
        >
          <div
            class="CoverContainer grey"
            :class="{ 'dark-style': isDarkMode }"
            style="vertical-align: middle;"
            :style="{
              'width': `${coverImageSize.width}px`,
              'height': `${coverImageSize.height}px`,
            }"
          >
            <!-- sheet cover image -->
            <picture
              v-if="!hideCover"
              :key="sheet.imageUrl"
            >
              <source
                v-if="sheet.imageUrlM != null"
                :srcset="sheet.imageUrlM"
                type="image/webp"
              >
              <img
                v-if="sheet.imageUrl != null"
                :src="sheet.imageUrl"
                alt=""
                class="CoverImage"
              >
            </picture>
            <div
              v-else
              class="CoverImage d-flex justify-center align-center grey white--text"
            >
              <span style="font-size: 2em;" v-text="sheet.songNo" />
            </div>

            <!-- sheet title (if the default cover image is used) -->
            <span
              v-if="(sheet.imageName ?? '').endsWith('default-cover.png') && !hideCover"
              class="CoverTitle"
              v-text="sheet.title"
            />

            <!-- locked icon -->
            <img
              v-if="sheet.isLocked && !hideLock"
              :src="getLockedIconUrl()"
              :height="getLockedIconHeight()"
              alt=""
              style="
                position: absolute;
                top: 0; right: 0;
                transform: translate(+50%, -50%);
                vertical-align: middle;"
            >

            <!-- type icon -->
            <img
              :src="getTypeIconUrl(sheet.type)"
              alt=""
              style="
                position: absolute;
                bottom: 0; left: -20px;
                transform: translate(0%, +50%);
                vertical-align: middle;"
              :style="{
                'width': 'auto',
                'height': `${getTypeIconHeight(sheet.type)}px`,
              }"
            >

            <!-- sheet internal level -->
            <span
              v-if="sheet.internalLevel != null && !hideLevel"
              class="SheetInternalLevel"
              v-text="sheet.internalLevel"
            />
          </div>
        </div>
      </template>
      <span v-text="sheet.title" />
    </v-tooltip>

    <!-- difficulty & level & description -->
    <div
      class="mt-4"
      style="text-align: center;"
      :style="{ 'max-width': `${coverImageSize.width + 16}px` }"
    >
      <div
        class="text-no-wrap font-weight-bold"
        :style="{
          'color': getDifficultyColor(sheet.difficulty),
          'font-size': sheet.levelValue && sheet.levelValue >= 100 ? 'small' : '',
        }"
      >
        <!-- sheet difficulty -->
        <template v-if="getDifficultyIconUrl(sheet.difficulty) != null">
          <img
            :src="getDifficultyIconUrl(sheet.difficulty)"
            :height="getDifficultyIconHeight(sheet.difficulty)"
            :alt="getDifficultyName(sheet.difficulty)"
            class="mr-1"
            style="vertical-align: middle;"
          >
        </template>
        <template v-else>
          <span v-text="getDifficultyName(sheet.difficulty)" />
        </template>

        <!-- sheet level -->
        <span v-if="!hideLevel" v-text="sheet.level" />
      </div>
      <div class="text-pre-wrap mt-1">
        <slot name="description" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SheetTile {
  position: relative;
  cursor: pointer;

  &.selected-sheet {
    background-color: #4eda !important;
  }

  .BlockingPanel {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .CoverBackground {
    display: inline-block;
  }

  .CoverContainer {
    display: inline-block;
    position: relative;
    box-shadow:
      // the gray shadows
      0 14px 28px rgb(0 0 0 / 25%),
      0 10px 10px rgb(0 0 0 / 22%);
    transition: transform 250ms;

    .CoverImage {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }

    .CoverTitle {
      // placement
      position: absolute;
      top: 0;
      left: 0;
      padding: 3px 6px;

      // text
      font-weight: bold;
      color: white;
      text-shadow:
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black,
        0 0 3px black;

      // alignment
      text-align: left;
      word-wrap: break-word;
      overflow: hidden;
      max-width: 100%;
      max-height: 100%;
    }

    .SheetInternalLevel {
      // placement
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      padding: 0 6px;
      min-width: 45px;
      border-radius: 3px;
      transform: translate(-50%, -50%);

      // text
      font-weight: bold;
      text-align: center;
      color: white;
      background-color: gray;
    }

    &.dark-style {
      box-shadow:
        // the yellow glowing effect
        0 14px 28px 5px rgb(255 255 0 / 50%),
        // the white glowing square
        0 0 0 10px rgb(255 255 255 / 22%);
    }
  }

  &:hover {
    box-shadow: 0 0 10px 5px rgb(0 0 0 / 25%);
    z-index: 1;

    .CoverContainer {
      transform: scale(1.2);
    }
  }
}
</style>
