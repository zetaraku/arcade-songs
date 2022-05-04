import { useDark } from '@vueuse/core';
import useVM from '~/composables/useVM';

export default function useDarkMode() {
  const vm = useVM()!;

  const isDarkMode = useDark({
    onChanged(isDark: boolean) {
      vm.$vuetify.theme.dark = isDark;
    },
  });

  return {
    isDarkMode,
  };
}
