import { defineStore } from 'pinia';
import LoadingStatus from '~/enums/LoadingStatus';
import sites from '~/data/sites.json';
import { buildEmptyData, preprocessData } from '~/utils';
import type { Data } from '~/types';

export default defineStore('data', {
  state: () => ({
    gameCode: '',
    loadedData: new Map<string, Data>(),
    loadingStatuses: new Map<string, LoadingStatus>(),
    loadingErrorMessages: new Map<string, string>(),
  }),
  getters: {
    currentData(state) {
      return state.loadedData.get(state.gameCode) ?? buildEmptyData();
    },
    currentLoadingStatus(state) {
      return state.loadingStatuses.get(state.gameCode) ?? LoadingStatus.PENDING;
    },
    currentLoadingErrorMessage(state) {
      return state.loadingErrorMessages.get(state.gameCode) ?? '';
    },
  },
  actions: {
    // we need these setters as Map is not reactive
    setLoadedData(gameCode: string, data: Data) {
      this.loadedData = new Map(this.loadedData.set(gameCode, data));
    },
    setLoadingStatus(gameCode: string, status: LoadingStatus) {
      this.loadingStatuses = new Map(this.loadingStatuses.set(gameCode, status));
    },
    setLoadingErrorMessage(gameCode: string, message: string) {
      this.loadingErrorMessages = new Map(this.loadingErrorMessages.set(gameCode, message));
    },

    async switchGameCode(gameCode: string) {
      this.gameCode = gameCode;

      if (this.currentLoadingStatus === LoadingStatus.PENDING) {
        await this.loadData(gameCode);
      }
    },
    async loadData(gameCode: string) {
      this.setLoadingStatus(gameCode, LoadingStatus.LOADING);
      try {
        const { dataSourceUrl } = sites.find((site) => site.gameCode === gameCode)!;

        const response = await fetch(`${dataSourceUrl}/data.json`);
        const data: Data = await response.json();

        preprocessData(data, dataSourceUrl);
        this.setLoadedData(gameCode, data);

        this.setLoadingStatus(gameCode, LoadingStatus.LOADED);
      } catch (error: any) {
        this.setLoadingErrorMessage(gameCode, error.message);
        this.setLoadingStatus(gameCode, LoadingStatus.ERROR);
      }
    },
  },
});
