import { computed, useRoute, useContext } from '@nuxtjs/composition-api';
import useDarkMode from '~/composables/useDarkMode';
import sites from '~/data/sites.json';

export default function useGameInfo() {
  const context = useContext();
  const route = useRoute();
  const { isDarkMode } = useDarkMode();

  const siteInfo = computed(
    () => sites
      .filter((site) => !site.isHidden || isDarkMode.value)
      .find((site) => site.gameCode === route.value.params.gameCode)
    ,
  );

  const gameCode = computed(() => (
    route.value.params.gameCode !== undefined
      ? siteInfo.value?.gameCode ?? undefined
      : null
  ));
  const gameTitle = computed(() => siteInfo.value?.gameTitle ?? undefined);
  const themeColor = computed(() => siteInfo.value?.themeColor ?? '#424242');
  const coverImageSize = computed(() => (
    siteInfo.value?.coverImageSize ?? { width: 100, height: 100 }
  ));
  const dataSourceUrl = computed(() => siteInfo.value?.dataSourceUrl ?? undefined);
  const accessCounterUrl = computed(() => (
    siteInfo.value?.accessCounterUrl ?? context.$config.indexAccessCounterUrl
  ));

  return {
    gameCode,
    gameTitle,
    themeColor,
    coverImageSize,
    dataSourceUrl,
    accessCounterUrl,
  };
}
