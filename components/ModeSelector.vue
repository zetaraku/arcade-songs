<script setup lang="ts">
import { inject, Ref } from '@nuxtjs/composition-api';

const displayMode: Ref<string> = inject('displayMode')!;
const filterMode: Ref<string> = inject('filterMode')!;
const selectedSheets: Ref<string[]> = inject('selectedSheets')!;
</script>

<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="6"
        class="d-flex justify-center align-center"
      >
        <v-radio-group
          v-model="displayMode"
          row
        >
          <v-radio value="grid">
            <template #label>
              <span>
                <v-icon>mdi-view-grid-outline</v-icon>
                {{ $t('sfc.ModeSelector.gridMode') }}
              </span>
            </template>
          </v-radio>
          <v-radio value="table">
            <template #label>
              <span>
                <v-icon>mdi-table</v-icon>
                {{ $t('sfc.ModeSelector.tableMode') }}
              </span>
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        class="d-flex justify-center align-center"
      >
        <v-radio-group
          v-model="filterMode"
          row
        >
          <v-radio value="filter">
            <template #label>
              <span>
                <v-icon>mdi-filter-menu-outline</v-icon>
                {{ $t('sfc.ModeSelector.filterMode') }}
              </span>
            </template>
          </v-radio>
          <v-radio value="my-list">
            <template #label>
              <span>
                <v-icon>mdi-playlist-music</v-icon>
                {{ $t('sfc.ModeSelector.myListMode') }}
                ({{ selectedSheets.length }})
              </span>
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>
