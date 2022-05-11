<script setup lang="ts">
import { computed } from '@nuxtjs/composition-api';
import useDataStore from '~/stores/data';
import LoadingStatus from '~/enums/LoadingStatus';
import { toLocalDateString } from '~/utils';

const dataStore = useDataStore();

const loadingStatus = computed(() => dataStore.currentLoadingStatus);
const updateTime = computed(() => new Date(dataStore.currentData.updateTime));
const errorMessage = computed(() => dataStore.currentLoadingErrorMessage);
</script>

<template>
  <v-container fluid>
    <v-alert
      v-if="loadingStatus === LoadingStatus.LOADING"
      type="info"
      dense
      outlined
    >
      {{ $t('sfc.DataInfoBar.loading') }}
    </v-alert>
    <v-alert
      v-else-if="loadingStatus === LoadingStatus.LOADED"
      type="success"
      dense
      outlined
    >
      {{ $t('sfc.DataInfoBar.updateTime', { time: toLocalDateString(updateTime) }) }}
    </v-alert>
    <v-alert
      v-else-if="loadingStatus === LoadingStatus.ERROR"
      type="error"
      dense
      outlined
    >
      {{ $t('sfc.DataInfoBar.loadFailed') }} ({{ errorMessage }})
    </v-alert>
  </v-container>
</template>
