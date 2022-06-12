<script setup lang="ts">
import { inject, Ref } from '@nuxtjs/composition-api';
import useGameData from '~/composables/useGameData';
import type { Sheet } from '~/types';

defineProps<{
  sheet: Sheet;
}>();

const isDarkMode: Ref<boolean> = inject('isDarkMode')!;

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
</script>

<template>
  <div
    v-ripple
    class="SheetTile rounded pa-3 ma-1"
    style="user-select: none;"
  >
    <v-tooltip
      top
      :nudge-bottom="95"
      :disabled="$vuetify.breakpoint.mobile"
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
          >
            <!-- sheet cover image -->
            <img
              :src="sheet.imageUrl"
              alt=""
              class="CoverImage"
            >

            <!-- sheet title (if the default cover image is used) -->
            <span
              v-if="sheet.imageName === 'default-cover.png'"
              class="CoverTitle"
              v-text="sheet.title"
            />

            <!-- locked icon -->
            <img
              v-if="sheet.isLocked"
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
              :height="getTypeIconHeight(sheet.type)"
              alt=""
              style="
                position: absolute;
                bottom: 0; left: -15px;
                transform: translate(0%, +50%);
                vertical-align: middle;"
            >

            <!-- sheet internal level -->
            <span
              v-if="sheet.internalLevel != null"
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
      style="width: 116px; text-align: center;"
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
        <span v-text="sheet.level" />
      </div>
      <div class="text-pre-wrap">
        <slot name="description" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SheetTile {
  position: relative;
  cursor: pointer;

  .BlockingPanel {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }

  .CoverBackground {
    display: inline-block;
  }

  .CoverContainer {
    display: inline-block;
    position: relative;
    width: 100px;
    height: 100px;
    box-shadow:
      // the gray shadows
      0px 14px 28px rgba(0, 0, 0, 0.25),
      0px 10px 10px rgba(0, 0, 0, 0.22);
    transition: transform 250ms;

    .CoverImage {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }
    .CoverTitle {
      position: absolute;
      top: 0;
      left: 0;
      padding: 3px 6px;

      font-weight: bold;
      color: white;
      -webkit-text-stroke: 5px black;
      paint-order: stroke;

      word-wrap: break-word;
      overflow: hidden;
      max-width: 100%;
      max-height: 100%;
    }
    .SheetInternalLevel {
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      padding: 0 3px;
      min-width: 40px;
      border-radius: 3px;
      transform: translate(-50%, -50%);

      font-weight: bold;
      text-align: center;
      color: white;
      background-color: gray;
    }

    &.dark-style {
      box-shadow:
        // the yellow glowing effect
        0px 14px 28px 5px rgba(255, 255, 0, 0.50),
        // the white glowing square
        0px 0px 0px 10px rgba(255, 255, 255, 0.22);
    }
  }

  &:hover {
    box-shadow: 0 0 10px 5px rgb(0, 0, 0, 0.25);

    .CoverContainer {
      transform: scale(1.2);
    }
  }
}
</style>
