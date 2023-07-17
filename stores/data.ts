import { ref, computed } from '@nuxtjs/composition-api';
import { defineStore } from 'pinia';
import LoadingStatus from '~/enums/LoadingStatus';
import sites from '~/data/sites.json';
import { buildEmptyData, preprocessData } from '~/utils';
import type { Data } from '~/types';

// eslint-disable-next-line import/prefer-default-export
export const useDataStore = defineStore('data', () => {
  const currentGameCode = ref('');

  const loadedData = ref(new Map<string, Data>());
  const loadingStatuses = ref(new Map<string, LoadingStatus>());
  const loadingErrorMessages = ref(new Map<string, string>());

  const currentData = computed(
    () => loadedData.value.get(currentGameCode.value) ?? buildEmptyData(),
  );
  const currentLoadingStatus = computed(
    () => loadingStatuses.value.get(currentGameCode.value) ?? LoadingStatus.PENDING,
  );
  const currentLoadingErrorMessage = computed(
    () => loadingErrorMessages.value.get(currentGameCode.value) ?? '',
  );

  async function loadData(gameCode: string) {
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

      const { dataSourceUrl } = sites.find((site) => site.gameCode === gameCode)!;

      const response = await fetch(`${dataSourceUrl}/data.json`);
      const data = await response.json() as Data;

      preprocessData(data, dataSourceUrl);

      setLoadedData(data);
      setLoadingStatus(LoadingStatus.LOADED);
    } catch (error: any) {
      setLoadingErrorMessage(error.message);
      setLoadingStatus(LoadingStatus.ERROR);
    }
  }
  async function switchGameCode(gameCode: string) {
    currentGameCode.value = gameCode;

    if (currentLoadingStatus.value === LoadingStatus.PENDING) {
      await loadData(gameCode);
    }
  }

  return {
    gameCode: currentGameCode,
    currentData,
    currentLoadingStatus,
    currentLoadingErrorMessage,
    switchGameCode,
  };
});
