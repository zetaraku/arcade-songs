<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { ref, computed, watch, inject, useMeta as useHead, Ref } from '@nuxtjs/composition-api';
import { useI18n } from 'nuxt-i18n-composable';
import useDataStore from '~/stores/data';
import useSheetDialog from '~/composables/useSheetDialog';
import type { GalleryList } from '~/types';

const isDarkMode: Ref<boolean> = inject('isDarkMode')!;

const i18n = useI18n();
const dataStore = useDataStore();
const { viewSheet } = useSheetDialog();

const currentList: Ref<GalleryList| null> = ref(null);

const lists = computed(
  () => dataStore.currentGallery.filter((list) => !list.isHidden || isDarkMode.value),
);

useHead(() => ({
  title: i18n.t('page-title.gallery') as string,
}));

watch(lists, () => {
  currentList.value = lists.value[0] ?? null;
}, { immediate: true });
</script>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'GalleryPage',
  head: {},
});
</script>

<template>
  <v-container class="text-center pa-8">
    <v-select
      v-model="currentList"
      :items="lists"
      :label="$t('page.gallery.selectList')"
      item-text="title"
      return-object
      hide-details
      outlined
      class="mb-10"
    />

    <!-- Current List -->
    <template v-if="currentList !== null">
      <!-- List description -->
      <p
        v-if="currentList.description != null"
        class="text-pre-wrap mb-10"
        v-text="currentList.description"
      />

      <!-- Sections -->
      <div
        v-for="(section, i) in currentList.sections"
        :key="i"
        class="mb-6"
        :class="{ 'yellow--text': currentList.isHidden }"
      >
        <!-- Section title -->
        <h1
          v-if="section.title != null"
          class="text-pre-wrap mb-4"
          v-text="section.title"
        />

        <!-- Section description -->
        <p
          v-if="section.description != null"
          class="text-pre-wrap"
          v-text="section.description"
        />

        <!-- Sheets -->
        <div
          v-if="section.sheets != null"
          class="d-flex flex-wrap justify-center"
        >
          <!-- Sheet tile -->
          <SheetTile
            v-for="(sheet, j) in section.sheets"
            :key="j"
            :sheet="sheet"
            @click="viewSheet(sheet);"
          >
            <!-- Sheet description -->
            <template #description>
              <span
                v-if="section.sheetDescriptions != null"
                v-text="section.sheetDescriptions[j]"
              />
            </template>
          </SheetTile>
        </div>
      </div>
    </template>
  </v-container>
</template>
