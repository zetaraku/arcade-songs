import { computed } from '@nuxtjs/composition-api';
import useI18n from '~/composables/useI18n';
import useGameInfo from '~/composables/useGameInfo';
import useGameData from '~/composables/useGameData';
import type { DataTableHeader } from 'vuetify';

function useOptionalHeaders(gameCode: string): DataTableHeader[] {
  const i18n = useI18n();

  if (gameCode === 'maimai') {
    return [
      {
        text: 'TAP',
        value: 'noteCounts.tap',
        width: 80,
        align: 'end',
      },
      {
        text: 'TAP %',
        value: 'notePercents.tap',
        width: 100,
        align: 'end',
      },
      {
        text: 'HOLD',
        value: 'noteCounts.hold',
        width: 80,
        align: 'end',
      },
      {
        text: 'HOLD %',
        value: 'notePercents.hold',
        width: 100,
        align: 'end',
      },
      {
        text: 'SLIDE',
        value: 'noteCounts.slide',
        width: 80,
        align: 'end',
      },
      {
        text: 'SLIDE %',
        value: 'notePercents.slide',
        width: 100,
        align: 'end',
      },
      {
        text: 'TOUCH',
        value: 'noteCounts.touch',
        width: 80,
        align: 'end',
      },
      {
        text: 'TOUCH %',
        value: 'notePercents.touch',
        width: 100,
        align: 'end',
      },
      {
        text: 'BREAK',
        value: 'noteCounts.break',
        width: 80,
        align: 'end',
      },
      {
        text: 'BREAK %',
        value: 'notePercents.break',
        width: 100,
        align: 'end',
      },
      {
        text: i18n.t('term.totalNotes') as string,
        value: 'noteCounts.total',
        width: 80,
        align: 'end',
      },
    ];
  }
  if (gameCode === 'chunithm') {
    return [
      {
        text: 'TAP',
        value: 'noteCounts.tap',
        width: 80,
        align: 'end',
      },
      {
        text: 'TAP %',
        value: 'notePercents.tap',
        width: 100,
        align: 'end',
      },
      {
        text: 'HOLD',
        value: 'noteCounts.hold',
        width: 80,
        align: 'end',
      },
      {
        text: 'HOLD %',
        value: 'notePercents.hold',
        width: 100,
        align: 'end',
      },
      {
        text: 'SLIDE',
        value: 'noteCounts.slide',
        width: 80,
        align: 'end',
      },
      {
        text: 'SLIDE %',
        value: 'notePercents.slide',
        width: 100,
        align: 'end',
      },
      {
        text: 'AIR',
        value: 'noteCounts.air',
        width: 80,
        align: 'end',
      },
      {
        text: 'AIR %',
        value: 'notePercents.air',
        width: 100,
        align: 'end',
      },
      {
        text: 'FLICK',
        value: 'noteCounts.flick',
        width: 80,
        align: 'end',
      },
      {
        text: 'FLICK %',
        value: 'notePercents.flick',
        width: 100,
        align: 'end',
      },
      {
        text: i18n.t('term.totalNotes') as string,
        value: 'noteCounts.total',
        width: 80,
        align: 'end',
      },
    ];
  }

  return [];
}

function useHeaders(): DataTableHeader[] {
  const i18n = useI18n();
  const {
    gameCode,
  } = useGameInfo();
  const {
    getCategoryIndex,
    getVersionIndex,
    getTypeIndex,
    getDifficultyIndex,
  } = useGameData();

  const optionalHeaders = useOptionalHeaders(gameCode.value!);

  return [
    {
      text: 'No.',
      value: 'songNo',
      width: 80,
      align: 'end',
    },
    // {
    //   text: i18n.t('term.category') as string,
    //   value: 'category',
    //   width: 200,
    //   sort: (a: string, b: string) => getCategoryIndex(a) - getCategoryIndex(b),
    // },
    {
      text: i18n.t('term.title') as string,
      value: 'title',
      width: 300,
    },
    // {
    //   text: i18n.t('term.artist') as string,
    //   value: 'artist',
    //   width: 150,
    // },
    {
      text: i18n.t('term.type') as string,
      value: 'type',
      width: 120,
      align: 'center',
      sort: (a: string, b: string) => getTypeIndex(a) - getTypeIndex(b),
    },
    {
      text: i18n.t('term.difficulty') as string,
      value: 'difficulty',
      width: 120,
      align: 'center',
      sort: (a: string, b: string) => getDifficultyIndex(a) - getDifficultyIndex(b),
    },
    {
      text: i18n.t('term.level') as string,
      value: 'levelValue',
      width: 100,
      align: 'center',
    },
    {
      text: i18n.t('term.internalLevel') as string,
      value: 'internalLevelValue',
      width: 100,
      align: 'center',
    },
    {
      text: i18n.t('term.bpm') as string,
      value: 'bpm',
      width: 100,
      align: 'center',
    },
    // {
    //   text: i18n.t('term.noteDesigner') as string,
    //   value: 'noteDesigner',
    //   width: 150,
    // },
    {
      text: i18n.t('term.version') as string,
      value: 'version',
      width: 150,
      align: 'center',
      sort: (a: string, b: string) => getVersionIndex(a) - getVersionIndex(b),
    },
    {
      text: i18n.t('term.releaseDate') as string,
      value: 'releaseDate',
      width: 120,
      align: 'center',
    },

    ...optionalHeaders,
  ];
}

export default function useSheetHeaders() {
  return computed<DataTableHeader[]>(() => useHeaders());
}
