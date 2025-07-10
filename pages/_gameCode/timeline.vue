<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { ref, computed, watch, useMeta as useHead } from '@nuxtjs/composition-api';
import { useDataStore } from '~/stores/data';
import useI18n from '~/composables/useI18n';
import useGameInfo from '~/composables/useGameInfo';
import useSheetComboDialog from '~/composables/useSheetComboDialog';
import SongTile from '~/components/SongTile.vue';

const i18n = useI18n();
const dataStore = useDataStore();
const { coverImageSize } = useGameInfo();
const { viewSheetCombo } = useSheetComboDialog();

const targetRegion = ref<string | null>(null);

const data = computed(() => dataStore.currentData);

const versionMap = computed(() => new Map(
  data.value.versions.map((version) => [version.version, version]),
));

const blocks = computed(() => [
  // all versions
  ...data.value.versions.toReversed()
    .map((version) => ({
      type: 'version' as const,
      typeOrder: 0,
      releaseDate: version.releaseDate,
      releaseDateValue: version.releaseDate != null
        ? new Date(version.releaseDate).valueOf()
        : null,
      version,
    })),

  // songs with release date
  ...[...Map.groupBy(
    data.value.songs.toReversed().filter((song) => song.releaseDate != null),
    (song) => song.releaseDate!,
  ).entries()]
    .map(([releaseDate, songs]) => ({
      type: 'songs' as const,
      typeOrder: 2,
      releaseDate,
      releaseDateValue: releaseDate != null
        ? new Date(releaseDate).valueOf()
        : null,
      songs,
    })),

  // songs without release date
  ...[...Map.groupBy(
    data.value.songs.toReversed().filter((song) => song.releaseDate == null),
    (song) => (song.version != null ? versionMap.value.get(song.version) : null),
  ).entries()]
    .map(([version, songs]) => [version?.releaseDate, songs] as const)
    .map(([releaseDate, songs]) => ({
      type: 'songs' as const,
      typeOrder: 1,
      releaseDate: releaseDate != null
        ? `${releaseDate} ~`
        : null,
      releaseDateValue: releaseDate != null
        ? new Date(releaseDate).valueOf()
        : null,
      songs,
    }))
    .filter((e) => e.releaseDateValue != null),
].toSorted(
  (a, b) => (
    (b.releaseDateValue ?? 0) - (a.releaseDateValue ?? 0)
    || b.typeOrder - a.typeOrder
  ),
));

watch(() => data.value.regions, () => {
  targetRegion.value = data.value.regions[0]?.region ?? null;
}, { immediate: true });

useHead(() => ({
  title: i18n.t('page-title.timeline') as string,
}));
</script>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'TimelinePage',
  head: {},
});
</script>

<template>
  <v-container class="py-6">
    <h1 class="mb-4">
      {{ $t('page-title.timeline') }}
    </h1>
    <v-select
      v-if="data.regions.length > 0"
      v-model="targetRegion"
      :items="data.regions.map(({ region, name }) => ({ text: name, value: region }))"
      prepend-icon="mdi-map-search"
      :label="$t('term.region')"
      persistent-placeholder
    />
    <v-timeline dense align-top>
      <template v-for="(block, i) in blocks">
        <v-timeline-item v-if="block.type === 'version'" :key="i" large icon="mdi-star">
          <div style="margin-top: +10px;">
            <h2 class="text-h5">
              <span class="font-weight-bold">{{ block.version.version }}</span>
              <span v-if="block.releaseDate != null">({{ block.releaseDate }})</span>
            </h2>
          </div>
        </v-timeline-item>
        <v-timeline-item v-else-if="block.type === 'songs'" :key="i" small color="grey">
          <div style="margin-top: -4px;">
            <h2 class="text-h5 mb-4">
              <span>{{ block.releaseDate ?? 'N/A' }}</span>
            </h2>
            <v-lazy :min-height="coverImageSize.height + 32">
              <div class="d-flex flex-wrap ml-n4">
                <SongTile
                  v-for="(song, j) in block.songs"
                  :key="j"
                  :song="song"
                  :class="{
                    'faded': targetRegion != null
                      && song.sheets.every((sheet) => sheet.regions?.[targetRegion ?? ''] === false)
                  }"
                  @click="viewSheetCombo(song.sheets, { title: song.title, asDrawPool: true });"
                />
              </div>
            </v-lazy>
          </div>
        </v-timeline-item>
      </template>
      <template v-if="blocks.length === 0">
        <v-timeline-item large icon="mdi-help">
          <div style="margin-top: +10px;">
            <h2 class="text-h5">
              <span class="font-weight-bold">{{ $vuetify.lang.t('$vuetify.noDataText') }}</span>
            </h2>
          </div>
        </v-timeline-item>
      </template>
    </v-timeline>
  </v-container>
</template>

<style lang="scss" scoped>
.faded {
  transition: opacity 500ms;

  &:not(:hover) {
    opacity: 0.2;
  }
}
</style>
