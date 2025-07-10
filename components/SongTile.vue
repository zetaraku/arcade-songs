<script setup lang="ts">
import useDarkMode from '~/composables/useDarkMode';
import useGameInfo from '~/composables/useGameInfo';
import useGameData from '~/composables/useGameData';
import type { Song } from '~/types';

withDefaults(defineProps<{
  song: Song,
  hideTitle?: boolean,
  hideCover?: boolean,
  hideLock?: boolean,
}>(), {
  hideTitle: false,
  hideCover: false,
  hideLock: false,
});

const { isDarkMode } = useDarkMode();
const { coverImageSize } = useGameInfo();
const {
  getLockedIconUrl,
  getLockedIconHeight,
} = useGameData();
</script>

<template>
  <div
    v-ripple
    class="SongTile rounded pa-2"
    style="user-select: none;"
  >
    <v-tooltip
      top
      :nudge-bottom="42 + coverImageSize.height / 2"
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
          :class="{ 'rainbow-background': song.sheets.some((sheet) => sheet.isSpecial) }"
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
            <!-- song cover image -->
            <v-img
              v-if="!hideCover"
              :key="song.imageUrl"
              :src="song.imageUrlM"
              class="CoverImage"
            />
            <div
              v-else
              class="CoverImage d-flex justify-center align-center grey white--text"
            >
              <span style="font-size: 2em;" v-text="song.songNo" />
            </div>

            <!-- song title (if the default cover image is used) -->
            <span
              v-if="(song.imageName ?? '').endsWith('default-cover.png') && !hideCover"
              class="CoverTitle"
              v-text="song.title"
            />

            <!-- locked icon -->
            <img
              v-if="song.isLocked && !hideLock"
              :src="getLockedIconUrl()"
              :height="getLockedIconHeight()"
              alt=""
              style="
                position: absolute;
                top: 0; right: 0;
                transform: translate(+50%, -50%);
                vertical-align: middle;"
            >
          </div>
        </div>
      </template>
      <span v-text="song.title" />
    </v-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.SongTile {
  position: relative;
  cursor: pointer;

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
