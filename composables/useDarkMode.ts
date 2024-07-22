import { storeToRefs } from 'pinia';
import { useMainStore } from '~/stores/main';

export default function useDarkMode() {
  const mainStore = useMainStore();
  const { isDarkMode } = storeToRefs(mainStore);

  return {
    isDarkMode,
  };
}
