import { computed } from '@nuxtjs/composition-api';
import useVM from '~/composables/useVM';
import useGameCode from '~/composables/useGameCode';

export default function useSideNav() {
  const vm = useVM()!;
  const { gameCode } = useGameCode();

  const menu = computed(() => {
    if (gameCode.value === undefined) return [];

    return [
      {
        icon: 'mdi-apps',
        title: vm.$t('page-title.home'),
        to: `/${gameCode.value}/`,
      },
      {
        icon: 'mdi-database',
        title: vm.$t('page-title.songs'),
        to: `/${gameCode.value}/songs/`,
      },
      {
        icon: 'mdi-script-text',
        title: vm.$t('page-title.song-lists'),
        to: `/${gameCode.value}/song-lists/`,
        disabled: true,
      },
      {
        icon: 'mdi-information-outline',
        title: vm.$t('page-title.about'),
        to: `/${gameCode.value}/about/`,
      },
      {
        icon: 'mdi-bug',
        title: vm.$t('page-title.bug-report'),
        href: 'https://github.com/zetaraku/arcade-songs/issues',
      },
    ];
  });

  return {
    menu,
  };
}
