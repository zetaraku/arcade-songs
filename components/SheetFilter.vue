<script setup lang="ts">
import { ref, computed, watch, inject, Ref } from '@nuxtjs/composition-api';
import useGtag from '~/composables/useGtag';
import useGameInfo from '~/composables/useGameInfo';
import useSheetDialog from '~/composables/useSheetDialog';
import SuperFilterDialog from '~/components/dialogs/SuperFilterDialog.vue';
import { parseSuperFilter, makeShyCatSheet } from '~/utils';
import type { Filters, FilterOptions } from '~/types';

const filters: Ref<Filters> = inject('filters')!;
const filterOptions: Ref<FilterOptions> = inject('filterOptions')!;

const gtag = useGtag();
const { gameCode } = useGameInfo();
const { viewSheet } = useSheetDialog();

const isSuperFilterDialogOpened = ref(false);

const currentLevelFilterOptions = computed(() => (
  filters.value.useInternalLevel
    ? filterOptions.value.internalLevels
    : filterOptions.value.levels
));

function validateSuperFilter(superFilterText: string): boolean | string {
  try {
    const superFilter = parseSuperFilter(superFilterText);

    if (typeof superFilter !== 'function') {
      if (typeof superFilter !== 'undefined') {
        viewSheet(makeShyCatSheet(superFilter, 'INVALID SUPER FILTER'));
        gtag('event', 'InvalidSuperFilterReturned', { gameCode: gameCode.value, eventSource: 'SheetFilter' });
      }

      throw new TypeError('You should return a predicate function.');
    }

    return true;
  } catch (err) {
    return String(err);
  }
}

// Sync Level Filter
watch(() => filters.value.minLevelValue, () => {
  if (filters.value.syncLevelValue) {
    filters.value.maxLevelValue = filters.value.minLevelValue;
  }
});
watch(() => filters.value.maxLevelValue, () => {
  if (filters.value.syncLevelValue) {
    filters.value.minLevelValue = filters.value.maxLevelValue;
  }
});
watch(() => filters.value.syncLevelValue, () => {
  if (filters.value.syncLevelValue) {
    const levelValue = filters.value.minLevelValue ?? filters.value.maxLevelValue;
    filters.value.minLevelValue = levelValue;
    filters.value.maxLevelValue = levelValue;
  }
}, { immediate: true });

// Sync BPM Filter
watch(() => filters.value.minBPM, () => {
  if (filters.value.syncBPM) {
    filters.value.maxBPM = filters.value.minBPM;
  }
});
watch(() => filters.value.maxBPM, () => {
  if (filters.value.syncBPM) {
    filters.value.minBPM = filters.value.maxBPM;
  }
});
watch(() => filters.value.syncBPM, () => {
  if (filters.value.syncBPM) {
    const bpm = filters.value.maxBPM ?? filters.value.minBPM;
    filters.value.minBPM = bpm;
    filters.value.maxBPM = bpm;
  }
}, { immediate: true });
</script>

<template>
  <div>
    <v-row>
      <!-- Category -->
      <v-col
        v-if="filterOptions.categories != null"
        cols="12"
        md="6"
        class="d-flex align-end"
      >
        <v-select
          v-model="filters.categories"
          :items="filterOptions.categories"
          prepend-icon="mdi-folder-multiple-outline"
          :label="$t('term.category')"
          :placeholder="$t('ui.all')"
          persistent-placeholder
          multiple
          chips
          deletable-chips
          clearable
        />
      </v-col>
      <!-- Title -->
      <v-col
        v-if="filterOptions.titles != null"
        cols="12"
        md="6"
        class="d-flex align-end"
      >
        <v-combobox
          v-model="filters.title"
          :items="filterOptions.titles"
          prepend-icon="mdi-alphabetical-variant"
          :label="$t('term.title')"
          :placeholder="$t('ui.all')"
          persistent-placeholder
          clearable
        />
      </v-col>
      <!-- Difficulty -->
      <v-col
        v-if="filterOptions.difficulties != null"
        cols="12"
        md="6"
        class="d-flex align-end"
      >
        <v-select
          v-model="filters.difficulties"
          :items="filterOptions.difficulties"
          prepend-icon="mdi-skull-outline"
          :label="$t('term.difficulty')"
          :placeholder="$t('ui.all')"
          persistent-placeholder
          multiple
          chips
          deletable-chips
          clearable
        />
      </v-col>
      <!-- Level / Internal Level -->
      <v-col
        v-if="filterOptions.levels != null"
        cols="12"
        md="6"
        class="d-flex align-end"
      >
        <div class="d-flex flex-grow-1 align-end" style="min-width: 0;">
          <v-select
            v-model="filters.minLevelValue"
            :items="currentLevelFilterOptions"
            prepend-icon="mdi-numeric-9-plus-box-multiple-outline"
            :label="filters.useInternalLevel ? $t('term.minInternalLevel') : $t('term.minLevel')"
            :placeholder="currentLevelFilterOptions?.at(0)?.text ?? '?'"
            persistent-placeholder
            clearable
          />
        </div>
        <div class="d-flex flex-grow-0 align-center px-2 align-self-stretch">
          <v-btn
            icon
            :color="!filters.syncLevelValue ? null : 'accent'"
            @click="
              filters.syncLevelValue = !filters.syncLevelValue || null;
              $gtag('event', 'LevelFilterSyncToggled', { gameCode, eventSource: 'SheetFilter' });
            "
          >
            <v-icon size="2.0em">
              {{ !filters.syncLevelValue ? 'mdi-link-off' : 'mdi-link' }}
            </v-icon>
          </v-btn>
        </div>
        <div class="d-flex flex-grow-1 align-end" style="min-width: 0;">
          <v-select
            v-model="filters.maxLevelValue"
            :items="currentLevelFilterOptions"
            :label="filters.useInternalLevel ? $t('term.maxInternalLevel') : $t('term.maxLevel')"
            :placeholder="currentLevelFilterOptions?.at(-1)?.text ?? '?'"
            persistent-placeholder
            clearable
          />
        </div>
        <div
          v-if="filterOptions.internalLevels != null && filterOptions.internalLevels.length !== 0"
          class="d-flex flex-grow-0 align-center pl-4 align-self-stretch"
        >
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                icon
                :color="!filters.useInternalLevel ? null : 'accent'"
                @click="
                  filters.useInternalLevel = !filters.useInternalLevel || null;
                  // eslint-disable-next-line max-len
                  $gtag('event', 'InternalLevelFilterToggled', { gameCode, eventSource: 'SheetFilter' });
                "
                v-on="on"
              >
                <v-icon size="2.4em">
                  <!-- eslint-disable-next-line max-len -->
                  {{ !filters.useInternalLevel ? 'mdi-closed-caption-outline' : 'mdi-closed-caption' }}
                </v-icon>
              </v-btn>
            </template>
            <span v-text="$t('sfc.SheetFilter.useInternalLevel')" />
          </v-tooltip>
        </div>
      </v-col>
      <!-- Version -->
      <v-col
        v-if="filterOptions.versions != null"
        cols="12"
        md="6"
        class="d-flex align-end"
      >
        <v-select
          v-model="filters.versions"
          :items="filterOptions.versions"
          prepend-icon="mdi-star-outline"
          :label="$t('term.version')"
          :placeholder="$t('ui.all')"
          persistent-placeholder
          multiple
          chips
          deletable-chips
          clearable
        />
      </v-col>
      <!-- Type -->
      <v-col
        v-if="filterOptions.types != null"
        cols="12"
        md="6"
        class="d-flex align-end"
      >
        <v-select
          v-model="filters.types"
          :items="filterOptions.types"
          prepend-icon="mdi-assistant"
          :label="$t('term.type')"
          :placeholder="$t('ui.all')"
          persistent-placeholder
          multiple
          chips
          deletable-chips
          clearable
        />
      </v-col>
      <!-- Artist -->
      <v-col
        v-if="filterOptions.artists != null"
        cols="12"
        md="6"
        class="d-flex align-end"
      >
        <v-combobox
          v-model="filters.artist"
          :items="filterOptions.artists"
          prepend-icon="mdi-account-music-outline"
          :label="$t('term.artist')"
          :placeholder="$t('ui.all')"
          persistent-placeholder
          clearable
        />
      </v-col>
      <!-- Note Designer -->
      <v-col
        v-if="filterOptions.noteDesigners != null"
        cols="12"
        md="6"
        class="d-flex align-end"
      >
        <v-select
          v-model="filters.noteDesigners"
          :items="filterOptions.noteDesigners"
          prepend-icon="mdi-account-edit-outline"
          :label="$t('term.noteDesigner')"
          :placeholder="$t('ui.all')"
          persistent-placeholder
          multiple
          chips
          deletable-chips
          clearable
        />
      </v-col>
      <!-- Region -->
      <v-col
        v-if="filterOptions.regions != null"
        cols="12"
        md="6"
        class="d-flex align-end"
      >
        <div class="d-flex flex-grow-1 align-end" style="min-width: 0;">
          <v-select
            v-model="filters.region"
            :items="filterOptions.regions"
            prepend-icon="mdi-map-search"
            :label="$t('term.region')"
            :placeholder="$t('ui.all')"
            persistent-placeholder
            clearable
          />
        </div>
        <div class="d-flex flex-grow-0 align-center pl-4 align-self-stretch">
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                icon
                :color="!filters.useRegionOverride ? null : 'accent'"
                :disabled="filters.region == null || filters.region.startsWith('!')"
                @click="
                  filters.useRegionOverride = !filters.useRegionOverride || null;
                  $gtag('event', 'RegionOverrideToggled', { gameCode, eventSource: 'SheetFilter' });
                "
                v-on="on"
              >
                <v-icon size="2.0em">
                  {{ !filters.useRegionOverride ? 'mdi-file-replace-outline' : 'mdi-file-replace' }}
                </v-icon>
              </v-btn>
            </template>
            <span v-text="$t('sfc.SheetFilter.useRegionOverride')" />
          </v-tooltip>
        </div>
      </v-col>
      <!-- BPM -->
      <v-col
        v-if="filterOptions.bpms != null"
        cols="12"
        md="6"
        class="d-flex align-end"
      >
        <div class="d-flex flex-grow-1 align-end" style="min-width: 0;">
          <v-text-field
            v-model.number="filters.minBPM"
            type="number"
            :min="0"
            prepend-icon="mdi-metronome"
            :label="$t('term.minBPM')"
            :placeholder="String(filterOptions.bpms.at(0) ?? 0)"
            persistent-placeholder
            clearable
          />
        </div>
        <div class="d-flex flex-grow-0 align-center px-2 align-self-stretch">
          <v-btn
            icon
            :color="!filters.syncBPM ? null : 'accent'"
            @click="
              filters.syncBPM = !filters.syncBPM || null;
              $gtag('event', 'BPMFilterSyncToggled', { gameCode, eventSource: 'SheetFilter' });
            "
          >
            <v-icon size="2.0em">
              {{ !filters.syncBPM ? 'mdi-link-off' : 'mdi-link' }}
            </v-icon>
          </v-btn>
        </div>
        <div class="d-flex flex-grow-1 align-end" style="min-width: 0;">
          <v-text-field
            v-model.number="filters.maxBPM"
            type="number"
            :min="0"
            :label="$t('term.maxBPM')"
            :placeholder="String(filterOptions.bpms.at(-1) ?? 999)"
            persistent-placeholder
            clearable
          />
        </div>
      </v-col>
      <!-- Super Filter -->
      <v-col
        v-if="filters.superFilter !== null"
        cols="12"
        md="6"
        class="d-flex align-end"
      >
        <v-textarea
          v-model="filters.superFilter"
          rows="3"
          :rules="[validateSuperFilter]"
          prepend-icon="mdi-code-braces-box"
          :label="`${$t('term.superFilter')} (JavaScript)`"
          :placeholder="$t('description.superFilterPlaceholder')"
          :hint="$t('description.superFilterHint')"
          persistent-placeholder
          outlined
          auto-grow
          readonly
          class="SuperFilter"
          style="font-family: Consolas, monospace;"
          @click="isSuperFilterDialogOpened = true;"
        />
        <SuperFilterDialog
          v-model="isSuperFilterDialogOpened"
          :super-filter-text.sync="filters.superFilter"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
::v-deep {
  .SuperFilter {
    textarea {
      cursor: pointer;
      caret-color: transparent;
    }
  }
}
</style>
