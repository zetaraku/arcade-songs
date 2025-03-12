import { computed } from '@nuxtjs/composition-api';
import { useDataStore } from '~/stores/data';
import useGameInfo from '~/composables/useGameInfo';
import type { Sheet } from '~/types';

export default function useGameData() {
  const dataStore = useDataStore();
  const data = computed(() => dataStore.currentData);
  const { gameTitle, dataSourceUrl } = useGameInfo();

  // Lock icon
  function getLockedIconUrl() {
    return new URL('locked.png', `${dataSourceUrl.value}/img/`).toString();
  }
  function getLockedIconHeight() {
    return 40;
  }

  // Category
  const categoryMap = computed(() => new Map(
    data.value.categories.map((e) => [e.category, e]),
  ));
  const categoryIndexMap = computed(() => new Map(
    data.value.categories.map((e, i) => [e.category, i]),
  ));
  function getCategoryData(category: string | undefined) {
    return categoryMap.value.get(category!);
  }
  function getCategoryIndex(category: string | undefined) {
    return categoryIndexMap.value.get(category!) ?? -1;
  }

  // Version
  const versionMap = computed(() => new Map(
    data.value.versions.map((e) => [e.version, e]),
  ));
  const versionIndexMap = computed(() => new Map(
    data.value.versions.map((e, i) => [e.version, i]),
  ));
  function getVersionData(version: string | undefined) {
    return versionMap.value.get(version!);
  }
  function getVersionAbbr(version: string | undefined) {
    return getVersionData(version)?.abbr ?? version;
  }
  function getVersionIndex(version: string | undefined) {
    return versionIndexMap.value.get(version!) ?? -1;
  }

  // Type
  const typeMap = computed(() => new Map(
    data.value.types.map((e) => [e.type, e]),
  ));
  const typeIndexMap = computed(() => new Map(
    data.value.types.map((e, i) => [e.type, i]),
  ));
  function getTypeData(type: string | undefined) {
    return typeMap.value.get(type!);
  }
  function getTypeName(type: string | undefined) {
    return getTypeData(type)?.name ?? String(type).toUpperCase();
  }
  function getTypeAbbr(type: string | undefined) {
    return getTypeData(type)?.abbr ?? String(type).toUpperCase();
  }
  function getTypeIconUrl(type: string | undefined) {
    return getTypeData(type)?.iconUrl ?? undefined;
  }
  function getTypeIconHeight(type: string | undefined) {
    return getTypeData(type)?.iconHeight ?? undefined;
  }
  function getTypeIndex(type: string | undefined) {
    return typeIndexMap.value.get(type!) ?? -1;
  }

  // Difficulty
  const difficultyMap = computed(() => new Map(
    data.value.difficulties.map((e) => [e.difficulty, e]),
  ));
  const difficultyIndexMap = computed(() => new Map(
    data.value.difficulties.map((e, i) => [e.difficulty, i]),
  ));
  function getDifficultyData(difficulty: string | undefined) {
    return difficultyMap.value.get(difficulty!);
  }
  function getDifficultyName(difficulty: string | undefined) {
    return getDifficultyData(difficulty)?.name ?? String(difficulty).toUpperCase();
  }
  function getDifficultyColor(difficulty: string | undefined) {
    return getDifficultyData(difficulty)?.color ?? 'unset';
  }
  function getDifficultyIconUrl(difficulty: string | undefined) {
    return getDifficultyData(difficulty)?.iconUrl ?? undefined;
  }
  function getDifficultyIconHeight(difficulty: string | undefined) {
    return getDifficultyData(difficulty)?.iconHeight ?? undefined;
  }
  function getDifficultyIndex(difficulty: string | undefined) {
    return difficultyIndexMap.value.get(difficulty!) ?? -1;
  }

  // Search link
  function getSheetSearchLinkIcon(sheet: Sheet) {
    if (sheet.searchUrl === null) return null;
    if (sheet.searchUrl === undefined) return 'mdi-youtube';
    if (sheet.searchUrl.includes('https://www.youtube.com/')) return 'mdi-youtube';

    return 'mdi-link-variant';
  }
  function getSheetSearchLinkColor(sheet: Sheet) {
    if (sheet.searchUrl === null) return null;
    if (sheet.searchUrl === undefined) return 'red';
    if (sheet.searchUrl.includes('https://www.youtube.com/')) return 'red';

    return 'primary';
  }
  function getSheetSearchLink(sheet: Sheet) {
    if (sheet.searchUrl === null) return null;
    if (sheet.searchUrl !== undefined) return sheet.searchUrl;

    const escapedGameTitle = gameTitle.value;
    const escapedTitle = sheet.title ?? '';
    const escapedDifficulty = getDifficultyName(sheet.difficulty);

    const url = new URL('https://www.youtube.com/results');
    url.searchParams.set(
      'search_query',
      `${escapedGameTitle} ${escapedTitle} ${escapedDifficulty}`.replaceAll('-', '\\-'),
    );

    return url.toString();
  }

  return {
    getLockedIconUrl,
    getLockedIconHeight,
    getCategoryData,
    getCategoryIndex,
    getVersionAbbr,
    getVersionIndex,
    getTypeName,
    getTypeAbbr,
    getTypeIconUrl,
    getTypeIconHeight,
    getTypeIndex,
    getDifficultyName,
    getDifficultyColor,
    getDifficultyIconUrl,
    getDifficultyIconHeight,
    getDifficultyIndex,
    getSheetSearchLinkIcon,
    getSheetSearchLinkColor,
    getSheetSearchLink,
  };
}
