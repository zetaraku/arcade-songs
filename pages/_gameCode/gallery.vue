<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { ref, computed, watch, onMounted, useRoute, useRouter, useMeta as useHead, useContext, Ref } from '@nuxtjs/composition-api';
import { until } from '@vueuse/core';
import YAML from 'yaml';
import selectFiles from 'select-files';
import { useDataStore } from '~/stores/data';
import useGtag from '~/composables/useGtag';
import useSentry from '~/composables/useSentry';
import useDarkMode from '~/composables/useDarkMode';
import useGameInfo from '~/composables/useGameInfo';
import useSheetDialog from '~/composables/useSheetDialog';
import LoadingOverlay from '~/components/LoadingOverlay.vue';
import SheetTile from '~/components/SheetTile.vue';
import LoadingStatus from '~/enums/LoadingStatus';
import sites from '~/data/sites.json';
import { buildGallery, isValidUrl } from '~/utils';
import type { Gallery, GalleryList } from '~/types';

const context = useContext();
const gtag = useGtag();
const sentry = useSentry();
const route = useRoute();
const router = useRouter();
const dataStore = useDataStore();
const { isDarkMode } = useDarkMode();
const { gameCode } = useGameInfo();
const { viewSheet } = useSheetDialog();

const galleryProviders = computed(() => [
  { type: 'default', title: 'Load from default' },
  { type: 'url', title: 'Load from URL' },
  { type: 'file', title: 'Load from File' },
  { type: 'example', title: 'View an Example!' },
]);

const currentGalleryProvider: Ref<string> = ref('');
const externalGalleryUrl: Ref<string> = ref('');
const currentLoadingStatus: Ref<LoadingStatus> = ref(LoadingStatus.PENDING);

const currentGallery: Ref<Gallery> = ref([]);
const currentLists = computed(
  () => currentGallery.value.filter((list) => !list.isHidden || isDarkMode.value),
);
const currentList: Ref<GalleryList | null> = ref(null);

async function loadDefaultGallery() {
  currentLoadingStatus.value = LoadingStatus.LOADING;
  try {
    const { dataSourceUrl } = sites.find((site) => site.gameCode === gameCode.value)!;

    const response = await fetch(`${dataSourceUrl}/gallery.yaml`);
    const data = YAML.parse(await response.text());

    await until(() => dataStore.currentLoadingStatus).toBe(LoadingStatus.LOADED);

    currentGalleryProvider.value = 'default';
    currentGallery.value = buildGallery(data, dataStore.currentData.sheets);
  } catch (err) {
    // sentry.captureException(err);

    currentLoadingStatus.value = LoadingStatus.ERROR;

    // eslint-disable-next-line no-console
    console.info('The gallery is currently unavailable.');

    return false;
  }
  currentLoadingStatus.value = LoadingStatus.LOADED;

  return true;
}

async function loadExternalGalleryFromUrl(galleryUrl: string) {
  // eslint-disable-next-line no-alert
  const confirm = window.confirm([
    'You are about to load an external gallery from the URL:',
    '', galleryUrl, '',
    'Continue?',
  ].join('\n'));

  if (!confirm) return false;

  if (!isValidUrl(galleryUrl)) {
    // eslint-disable-next-line no-alert
    window.alert('Please enter a valid URL.');

    return false;
  }

  currentLoadingStatus.value = LoadingStatus.LOADING;
  try {
    const response = await fetch(galleryUrl);
    const data = YAML.parse(await response.text());

    await until(() => dataStore.currentLoadingStatus).toBe(LoadingStatus.LOADED);

    externalGalleryUrl.value = galleryUrl;
    currentGalleryProvider.value = 'url';
    currentGallery.value = buildGallery(data, dataStore.currentData.sheets);
  } catch (err) {
    sentry.captureException(err);

    currentLoadingStatus.value = LoadingStatus.ERROR;

    // eslint-disable-next-line no-alert
    window.alert([
      'Encounter an error while reading from url:',
      err,
    ].join('\n'));
    // eslint-disable-next-line no-console
    console.error(err);

    return false;
  }
  currentLoadingStatus.value = LoadingStatus.LOADED;

  gtag('event', 'ExternalGalleryLoaded', { gameCode: gameCode.value, eventSource: 'GalleryPage', url: galleryUrl });

  return true;
}

async function loadExternalGalleryFromFile(galleryFile: File) {
  // eslint-disable-next-line no-alert
  const confirm = window.confirm([
    'You are about to load an external gallery from the file:',
    '', galleryFile.name, '',
    'Continue?',
  ].join('\n'));

  if (!confirm) return false;

  currentLoadingStatus.value = LoadingStatus.LOADING;
  try {
    const data = YAML.parse(await galleryFile.text());

    await until(() => dataStore.currentLoadingStatus).toBe(LoadingStatus.LOADED);

    currentGalleryProvider.value = 'file';
    currentGallery.value = buildGallery(data, dataStore.currentData.sheets);
  } catch (err) {
    sentry.captureException(err);

    currentLoadingStatus.value = LoadingStatus.ERROR;

    // eslint-disable-next-line no-alert
    window.alert([
      'Encounter an error while reading from file:',
      err,
    ].join('\n'));
    // eslint-disable-next-line no-console
    console.error(err);

    return false;
  }
  currentLoadingStatus.value = LoadingStatus.LOADED;

  return true;
}

async function changeGalleryProvider(providerType: string) {
  if (providerType === 'default') {
    await loadDefaultGallery();
  } else if (providerType === 'url') {
    // eslint-disable-next-line no-alert
    const galleryUrl = window.prompt('Please enter a gallery data URL:');

    if (galleryUrl === null) return;

    await loadExternalGalleryFromUrl(galleryUrl);
  } else if (providerType === 'file') {
    const files = await selectFiles({ accept: '.yaml', multiple: false });

    if (files === null || files.length === 0) return;

    const galleryFile = files[0];

    await loadExternalGalleryFromFile(galleryFile);
  } else if (providerType === 'example') {
    window.open('/maimai/gallery/?url=https%3A%2F%2Fgist.githubusercontent.com%2Fzetaraku%2Fc8a28b5bbd17cd421278ec45f4e4e953%2Fraw%2F');
  }
}

useHead(() => ({
  title: (
    currentList.value !== null
      ? `${currentList.value.title} | ${context.i18n.t('page-title.gallery')}`
      : context.i18n.t('page-title.gallery') as string
  ),
}));

onMounted(async () => {
  if (route.value.query.url !== undefined) {
    const externalGalleryLoaded = await loadExternalGalleryFromUrl(route.value.query.url as string);

    if (!externalGalleryLoaded) {
      await loadDefaultGallery();
      return;
    }
  } else {
    await loadDefaultGallery();
  }

  if (route.value.query.id !== undefined) {
    currentList.value = currentLists.value
      .find((list) => list.id === route.value.query.id) ?? currentList.value;
  }
  if (route.value.query.title !== undefined) {
    currentList.value = currentLists.value
      .find((list) => list.title === route.value.query.title) ?? currentList.value;
  }
});

watch(currentLists, () => {
  currentList.value = currentLists.value[0] ?? null;
});
watch(currentList, () => {
  if (currentList.value === null) return;

  const listKey = (() => {
    if (currentList.value.id != null) return { id: currentList.value.id };
    if (currentList.value.title != null) return { title: currentList.value.title };
    return {};
  })();

  router.push({
    query: {
      ...listKey,
      url: currentGalleryProvider.value === 'url' ? externalGalleryUrl.value : undefined,
    },
  });
});
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
    <LoadingOverlay
      v-if="
        currentLoadingStatus === LoadingStatus.LOADING
          && dataStore.currentLoadingStatus !== LoadingStatus.LOADING
      "
    />

    <v-row class="mb-10">
      <v-col>
        <v-select
          v-model="currentList"
          :items="currentLists"
          :label="$t('page.gallery.selectList')"
          item-text="title"
          return-object
          hide-details
          outlined
        />
      </v-col>
      <v-col cols="auto" class="d-flex align-center">
        <v-menu offset-y>
          <template #activator="{ on }">
            <v-btn
              outlined
              color="success"
              class="px-4 py-6"
              v-on="on"
            >
              <v-icon>mdi-list-box-outline</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(provider, i) in galleryProviders"
              :key="i"
              @click="changeGalleryProvider(provider.type);"
            >
              <v-list-item-title>
                {{ provider.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <v-alert
      v-if="currentGalleryProvider === 'url'"
      type="info"
      class="mb-6"
      outlined
    >
      You are currently viewing an external gallery from
      👉 <a :href="externalGalleryUrl" target="_blank">this URL</a>.<br>
      The content is not created by this site and we have no control over it.
    </v-alert>
    <v-alert
      v-if="currentGalleryProvider === 'file'"
      type="info"
      class="mb-6"
      outlined
    >
      You are currently viewing an external gallery from
      <b>your local file</b>.<br>
      The content is not created by this site and we have no control over it.
    </v-alert>

    <!-- Current List -->
    <template v-if="currentList !== null">
      <!-- List title -->
      <h1
        class="text-pre-wrap mb-8"
        v-text="currentList.title"
      />

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
        <h2
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
            @click="
              viewSheet(sheet);
              $gtag('event', 'SheetViewed', { gameCode, eventSource: 'GalleryPage' });
            "
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

<style lang="scss" scoped>
::v-deep {
  .v-alert__icon {
    margin: auto 16px auto 0;
  }
}
</style>
