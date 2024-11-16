import { ref, computed, watch } from '@nuxtjs/composition-api';
import { defineStore } from 'pinia';
import useSentry from '~/composables/useSentry';
import LoadingStatus from '~/enums/LoadingStatus';
import sites from '~/data/sites.json';
import { buildEmptyData, preprocessData } from '~/utils';
import type { Data } from '~/types';

// eslint-disable-next-line import/prefer-default-export
export const useDataStore = defineStore('data', () => {
  const currentGameCode = ref<string | null>(null);

  const loadedData = ref(new Map<string | null, Data>());
  const loadingStatuses = ref(new Map<string | null, LoadingStatus>());
  const loadingErrorMessages = ref(new Map<string | null, string>());

  const currentData = computed(
    () => loadedData.value.get(currentGameCode.value) ?? buildEmptyData(),
  );
  const currentLoadingStatus = computed(
    () => loadingStatuses.value.get(currentGameCode.value) ?? LoadingStatus.PENDING,
  );
  const currentLoadingErrorMessage = computed(
    () => loadingErrorMessages.value.get(currentGameCode.value) ?? '',
  );

  const sentry = useSentry();

  async function loadData(gameCode: string) {
    const dataSourceUrl = sites.find((site) => site.gameCode === gameCode)?.dataSourceUrl;

    if (dataSourceUrl === undefined) {
      // eslint-disable-next-line no-console
      console.warn(`"${gameCode}" is not a valid gameCode`);
      return;
    }

    // helper functions
    function setLoadedData(data: Data) {
      loadedData.value = new Map(loadedData.value.set(gameCode, data));
    }
    function setLoadingStatus(status: LoadingStatus) {
      loadingStatuses.value = new Map(loadingStatuses.value.set(gameCode, status));
    }
    function setLoadingErrorMessage(message: string) {
      loadingErrorMessages.value = new Map(loadingErrorMessages.value.set(gameCode, message));
    }

    try {
      setLoadingStatus(LoadingStatus.LOADING);

      const response = await fetch(`${dataSourceUrl}/data.json`);
      const data = await response.json() as Data;

      preprocessData(data, dataSourceUrl, gameCode);

      setLoadedData(data);
      setLoadingStatus(LoadingStatus.LOADED);
    } catch (err: any) {
      sentry.captureException(err);

      setLoadingErrorMessage(err.message);
      setLoadingStatus(LoadingStatus.ERROR);
    }
  }

  watch(currentGameCode, async () => {
    if (currentGameCode.value === null) return;

    if (currentLoadingStatus.value === LoadingStatus.PENDING) {
      await loadData(currentGameCode.value);
    }
  });

  return {
    gameCode: currentGameCode,
    currentData,
    currentLoadingStatus,
    currentLoadingErrorMessage,
  };
});
