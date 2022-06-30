import { computed } from '@nuxtjs/composition-api';
import { useI18n } from 'nuxt-i18n-composable';
import useGameInfo from '~/composables/useGameInfo';
import useGameData from '~/composables/useGameData';
import type { DataTableHeader } from 'vuetify';

export default function useSheetHeaders() {
  const i18n = useI18n();
  const { gameCode } = useGameInfo();
  const {
    getCategoryIndex,
    getVersionIndex,
    getTypeIndex,
    getDifficultyIndex,
  } = useGameData();

  const optionalHeaders = computed<Record<string, DataTableHeader[]>>(() => ({
    maimai: [
      {
        text: 'TAP',
        value: 'noteCounts.tap',
        width: 50,
      },
      {
        text: 'TAP %',
        value: 'notePercents.tap',
        width: 50,
      },
      {
        text: 'HOLD',
        value: 'noteCounts.hold',
        width: 50,
      },
      {
        text: 'HOLD %',
        value: 'notePercents.hold',
        width: 50,
      },
      {
        text: 'SLIDE',
        value: 'noteCounts.slide',
        width: 50,
      },
      {
        text: 'SLIDE %',
        value: 'notePercents.slide',
        width: 50,
      },
      {
        text: 'TOUCH',
        value: 'noteCounts.touch',
        width: 50,
      },
      {
        text: 'TOUCH %',
        value: 'notePercents.touch',
        width: 50,
      },
      {
        text: 'BREAK',
        value: 'noteCounts.break',
        width: 50,
      },
      {
        text: 'BREAK %',
        value: 'notePercents.break',
        width: 50,
      },
      {
        text: i18n.t('term.totalNotes') as string,
        value: 'noteCounts.total',
        width: 50,
      },
    ],
  }));
  const headers = computed<DataTableHeader[]>(() => [
    {
      text: 'No.',
      value: 'songNo',
      width: 10,
    },
    {
      text: i18n.t('term.category') as string,
      value: 'category',
      width: 200,
      sort: (a: string, b: string) => getCategoryIndex(a) - getCategoryIndex(b),
    },
    {
      text: i18n.t('term.title') as string,
      value: 'title',
      width: 300,
    },
    {
      text: i18n.t('term.type') as string,
      value: 'type',
      width: 75,
      sort: (a: string, b: string) => getTypeIndex(a) - getTypeIndex(b),
    },
    {
      text: i18n.t('term.difficulty') as string,
      value: 'difficulty',
      width: 100,
      sort: (a: string, b: string) => getDifficultyIndex(a) - getDifficultyIndex(b),
    },
    {
      text: i18n.t('term.level') as string,
      value: 'levelValue',
      width: 100,
    },
    {
      text: i18n.t('term.internalLevel') as string,
      value: 'internalLevelValue',
      width: 100,
    },

    ...(optionalHeaders.value[gameCode.value!] ?? []),

    {
      text: i18n.t('term.bpm') as string,
      value: 'bpm',
      width: 50,
    },
    {
      text: i18n.t('term.noteDesigner') as string,
      value: 'noteDesigner',
      width: 150,
    },
    {
      text: i18n.t('term.version') as string,
      value: 'version',
      width: 150,
      sort: (a: string, b: string) => getVersionIndex(a) - getVersionIndex(b),
    },
  ]);

  return headers;
}
