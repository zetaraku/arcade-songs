import { defineStore } from 'pinia';
import LoadingStatus from '~/enums/LoadingStatus';
import sites from '~/assets/sites.json';
import { buildEmptyData, preprocessData, makeDummySheet } from '~/utils';
import type { Data, GalleryList } from '~/types';

export default defineStore('data', {
  state: () => ({
    gameCode: '',
    loadedData: new Map<string, Data>(),
    loadedGallery: new Map<string, GalleryList[]>(),
    loadingStatuses: new Map<string, LoadingStatus>(),
    loadingErrorMessages: new Map<string, string>(),
  }),
  getters: {
    currentData(state) {
      return state.loadedData.get(state.gameCode) ?? buildEmptyData();
    },
    currentGallery(state) {
      return state.loadedGallery.get(state.gameCode) ?? [];
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
    setLoadedGallery(gameCode: string, gallery: GalleryList[]) {
      this.loadedGallery = new Map(this.loadedGallery.set(gameCode, gallery));
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

        await this.loadGallery(gameCode);

        this.setLoadingStatus(gameCode, LoadingStatus.LOADED);
      } catch (error: any) {
        this.setLoadingErrorMessage(gameCode, error.message);
        this.setLoadingStatus(gameCode, LoadingStatus.ERROR);
      }
    },
    async loadGallery(gameCode: string) {
      try {
        const { dataSourceUrl } = sites.find((site) => site.gameCode === gameCode)!;

        const response = await fetch(`${dataSourceUrl}/gallery.json`);
        const data = await response.json();

        const gallery = data.map((page: Record<string, any>) => ({
          ...page,
          sections: page.sections.map((section: Record<string, any>) => ({
            ...section,
            sheets: section.sheets?.map(
              (sheetExpr: string) => this.currentData.sheets.find(
                (sheet) => sheet.sheetExpr === sheetExpr,
              ) ?? makeDummySheet(sheetExpr),
            ),
          })),
        })) as GalleryList[];

        this.setLoadedGallery(gameCode, gallery);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('The gallery is currently unavailable.');
      }
    },
  },
});
