<script setup lang="ts">
import { computed, inject, Ref } from '@nuxtjs/composition-api';
import useGameInfo from '~/composables/useGameInfo';
import { parseSuperFilter } from '~/utils';
import type { Filters, FilterOptions } from '~/types';

const filters: Ref<Filters> = inject('filters')!;
const filterOptions: Ref<FilterOptions> = inject('filterOptions')!;

const { gameCode } = useGameInfo();

const currentLevelFilterOptions = computed(() => (
  filters.value.useInternalLevel
    ? filterOptions.value.internalLevels
    : filterOptions.value.levels
));

function validateSuperFilter(superFilterText: string): boolean | string {
  try {
    const superFilter = parseSuperFilter(superFilterText);

    if (typeof superFilter !== 'function') throw new TypeError('You should return a predicate function.');

    return true;
  } catch (err) {
    return String(err);
  }
}
</script>

<template>
  <div>
    <v-row>
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
        <div class="d-flex flex-grow-1 align-end pl-6" style="min-width: 0;">
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
          class="d-flex flex-grow-0 align-center pl-6 align-self-stretch"
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
        <div class="d-flex flex-grow-0 align-center pl-6 align-self-stretch">
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
        <div class="d-flex flex-grow-1 align-end pl-6" style="min-width: 0;">
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
          clearable
          outlined
          style="font-family: Consolas, monospace;"
        />
      </v-col>
    </v-row>
  </div>
</template>
