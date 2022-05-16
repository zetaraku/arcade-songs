import { computed } from '@nuxtjs/composition-api';
import useDataStore from '~/stores/data';
import useGameCode from '~/composables/useGameCode';

export default function useGameData() {
  const dataStore = useDataStore();
  const data = computed(() => dataStore.currentData);
  const { dataSourceUrl } = useGameCode();

  // Lock icon
  function getLockedIconUrl() {
    return new URL('locked.png', `${dataSourceUrl.value}/img/`).toString();
  }
  function getLockedIconHeight() {
    return 40;
  }

  // Category
  function getCategoryData(category: string | undefined) {
    return data.value.categories.find((e) => e.category === category);
  }
  function getCategoryIndex(category: string | undefined) {
    return data.value.categories.findIndex((e) => e.category === category);
  }

  // Version
  function getVersionData(version: string | undefined) {
    return data.value.versions.find((e) => e.version === version);
  }
  function getVersionAbbr(version: string | undefined) {
    return getVersionData(version)?.abbr ?? version;
  }
  function getVersionIndex(version: string | undefined) {
    return data.value.versions.findIndex((e) => e.version === version);
  }

  // Type
  function getTypeData(type: string | undefined) {
    return data.value.types.find((e) => e.type === type);
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
    return data.value.types.findIndex((e) => e.type === type);
  }

  // Difficulty
  function getDifficultyData(difficulty: string | undefined) {
    return data.value.difficulties.find((e) => e.difficulty === difficulty);
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
    return data.value.difficulties.findIndex((e) => e.difficulty === difficulty);
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
  };
}
