import { ref } from '@nuxtjs/composition-api';
import { defineStore } from 'pinia';

// eslint-disable-next-line import/prefer-default-export
export const useMainStore = defineStore('main', () => {
  const isDarkMode = ref(false);

  return {
    isDarkMode,
  };
});
