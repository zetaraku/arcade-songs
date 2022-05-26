import { computed } from '@nuxtjs/composition-api';
import useVM from '~/composables/useVM';
import useGameInfo from '~/composables/useGameInfo';

export default function useSideNav() {
  const vm = useVM()!;
  const { gameCode } = useGameInfo();

  const menu = computed(() => {
    if (gameCode.value === undefined) return [];

    return [
      {
        icon: 'mdi-apps',
        title: vm.$t('page-title.home'),
        to: `/${gameCode.value}/`,
      },
      {
        icon: 'mdi-script-text',
        title: vm.$t('page-title.lists'),
        to: `/${gameCode.value}/lists/`,
        disabled: true,
      },
      {
        icon: 'mdi-information-outline',
        title: vm.$t('page-title.about'),
        to: `/${gameCode.value}/about/`,
      },
      {
        icon: 'mdi-comment-question',
        title: vm.$t('page-title.bug-report'),
        href: 'https://arcade-songs-report.zetaraku.dev/',
      },
    ];
  });

  return {
    menu,
  };
}
