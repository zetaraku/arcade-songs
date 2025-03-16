import { getRegionOverrideSheet, getCanonicalSheet } from '~/utils/sheet';
import { parseBoolean, isEmptyArray } from '~/utils/misc';
import type { NuxtI18nInstance } from '@nuxtjs/i18n';
import type { Data, Sheet, Filters, FilterOptions } from '~/types';

const filterTypes = {
  categories: 'string[]',
  title: 'string',
  matchExactTitle: 'boolean',
  artist: 'string',
  matchExactArtist: 'boolean',

  versions: 'string[]',
  minBPM: 'number',
  maxBPM: 'number',
  // syncBPM: 'boolean',

  types: 'string[]',
  difficulties: 'string[]',
  minLevelValue: 'number',
  maxLevelValue: 'number',
  // syncLevelValue: 'boolean',
  useInternalLevel: 'boolean',

  noteDesigners: 'string[]',
  region: 'string',
  useRegionOverride: 'boolean',

  // Super Filter is not saved or loaded due to security concerns
  // superFilter: 'string',
};

export function buildEmptyFilters(): Filters {
  return {
    categories: [],
    title: null,
    matchExactTitle: null,
    artist: null,
    matchExactArtist: null,

    versions: [],
    minBPM: null,
    maxBPM: null,
    syncBPM: null,

    types: [],
    difficulties: [],
    minLevelValue: null,
    maxLevelValue: null,
    syncLevelValue: null,
    useInternalLevel: null,

    noteDesigners: [],
    region: null,
    useRegionOverride: null,

    superFilter: null,
  };
}

export function buildEmptyFilterOptions(): FilterOptions {
  return {
    categories: [],
    titles: [],
    artists: [],

    versions: [],
    bpms: [],

    types: [],
    difficulties: [],
    levels: [],
    internalLevels: [],

    noteDesigners: [],
    regions: [],
  };
}

export function buildFilterOptions(data: Data, i18n: NuxtI18nInstance): FilterOptions {
  if (data.updateTime === '0000-00-00') {
    // return empty array instead of null to preserve all filters ui before the data is loaded
    return buildEmptyFilterOptions();
  }

  const nonEmptyOrNull = <T>(arr: T[]) => (arr.length !== 0 ? arr : null);

  return {
    categories: nonEmptyOrNull(
      data.categories
        .map(({ category }) => ({
          text: category ?? 'N/A',
          value: category,
        })),
    ),
    titles: nonEmptyOrNull(
      [...new Set(data.songs.map((song) => song.title!))]
        .filter((title) => title != null),
    ),
    artists: nonEmptyOrNull(
      [...new Set(data.songs.map((song) => song.artist!))]
        .filter((artist) => artist != null),
    ),

    versions: nonEmptyOrNull(
      data.versions
        .map(({ version, abbr }) => ({
          text: abbr ?? version ?? 'N/A',
          value: version,
        })),
    ),
    bpms: nonEmptyOrNull(
      [...new Set(data.songs.map((song) => song.bpm!))]
        .filter((bpm) => bpm != null)
        .sort((a, b) => a - b),
    ),

    types: nonEmptyOrNull(
      data.types
        .map(({ type, name }) => ({
          text: name,
          value: type,
        })),
    ),
    difficulties: nonEmptyOrNull(
      data.difficulties
        .map(({ difficulty, name }) => ({
          text: name,
          value: difficulty,
        })),
    ),
    levels: nonEmptyOrNull(
      [...new Map(
        data.sheets
          .filter((sheet) => sheet.levelValue != null && sheet.level != null && !sheet.level.endsWith('?'))
          .map((sheet) => [sheet.levelValue!, sheet.level!]),
      ).entries()]
        .sort(([aLevelValue], [bLevelValue]) => aLevelValue - bLevelValue)
        .map(([levelValue, level]) => ({
          text: level,
          value: levelValue,
        })),
    ),
    internalLevels: nonEmptyOrNull(
      [...new Map(
        data.sheets
          .filter((sheet) => sheet.internalLevelValue != null)
          .map((sheet) => [sheet.internalLevelValue!, sheet.internalLevelValue!.toFixed(1)]),
      ).entries()]
        .sort(([aLevelValue], [bLevelValue]) => aLevelValue - bLevelValue)
        .map(([levelValue, level]) => ({
          text: level,
          value: levelValue,
        })),
    ),

    noteDesigners: nonEmptyOrNull(
      [...new Set(data.sheets.map((sheet) => sheet.noteDesigner!))]
        .map((noteDesigner) => ({
          noteDesigner,
          sheetCount: data.sheets.filter((sheet) => sheet.noteDesigner === noteDesigner).length,
        }))
        .filter(({ noteDesigner }) => noteDesigner != null)
        .sort((a, b) => b.sheetCount - a.sheetCount)
        .map(({ noteDesigner, sheetCount }) => ({
          text: `${noteDesigner} (${sheetCount})`,
          value: noteDesigner,
        })),
    ),
    regions: nonEmptyOrNull(
      data.regions.flatMap(({ region, name }) => [
        {
          text: name,
          value: `${region}`,
        },
        {
          text: i18n.t('description.unavailableInRegion', { region: name }) as string,
          value: `!${region}`,
        },
      ]),
    ),
  };
}

export function parseSuperFilter(superFilterText: string) {
  // eslint-disable-next-line no-new-func
  return (new Function(superFilterText))();
}

export function filterSheets(sheets: Sheet[], filters: Filters) {
  let result = sheets.slice();

  if (filters.useRegionOverride) {
    const currentRegion = filters.region != null && !filters.region.startsWith('!') ? filters.region : null;

    if (currentRegion != null) {
      result = result.map((sheet) => getRegionOverrideSheet(sheet, currentRegion));
    }
  }

  if (filters.region != null) {
    if (filters.region.startsWith('!')) {
      const excludedRegion = filters.region.replace(/^!/, '');
      result = result.filter(
        (sheet) => (
          sheet.regions == null
          || !sheet.regions[excludedRegion]
        ),
      );
    } else {
      const includedRegion = filters.region;
      result = result.filter(
        (sheet) => (
          sheet.regions != null
          && sheet.regions[includedRegion]
        ),
      );
    }
  }
  if (filters.categories.length !== 0) {
    const categorySet = new Set(filters.categories);
    result = result.filter(
      (sheet) => (
        categorySet.has(sheet.category!)
        || (
          sheet.category != null
          && sheet.category.split('|').some((category) => categorySet.has(category))
        )
      ),
    );
  }
  if (filters.title != null) {
    if (filters.matchExactTitle) {
      result = result.filter(
        (sheet) => (sheet.title === filters.title),
      );
    } else {
      const normalizedTitle = filters.title.toLowerCase();
      result = result.filter(
        (sheet) => (
          sheet.title != null
          && sheet.title.toLowerCase().includes(normalizedTitle)
        ),
      );
    }
  }
  if (filters.versions.length !== 0) {
    const versionSet = new Set(filters.versions);
    result = result.filter(
      (sheet) => versionSet.has(sheet.version!),
    );
  }
  if (filters.types.length !== 0) {
    const typeSet = new Set(filters.types);
    result = result.filter(
      (sheet) => typeSet.has(sheet.type!),
    );
  }
  if (filters.difficulties.length !== 0) {
    const difficultySet = new Set(filters.difficulties);
    result = result.filter(
      (sheet) => difficultySet.has(sheet.difficulty!),
    );
  }
  if (typeof filters.minLevelValue === 'number') {
    if (filters.useInternalLevel) {
      result = result.filter(
        (sheet) => (
          sheet.internalLevelValue != null
          && sheet.internalLevelValue >= filters.minLevelValue!
        ),
      );
    } else {
      result = result.filter(
        (sheet) => (
          sheet.levelValue != null
          && sheet.levelValue >= filters.minLevelValue!
        ),
      );
    }
  }
  if (typeof filters.maxLevelValue === 'number') {
    if (filters.useInternalLevel) {
      result = result.filter(
        (sheet) => (
          sheet.internalLevelValue != null
          && sheet.internalLevelValue <= filters.maxLevelValue!
        ),
      );
    } else {
      result = result.filter(
        (sheet) => (
          sheet.levelValue != null
          && sheet.levelValue <= filters.maxLevelValue!
        ),
      );
    }
  }
  if (typeof filters.minBPM === 'number') {
    result = result.filter(
      (sheet) => (
        sheet.bpm != null
        && sheet.bpm >= filters.minBPM!
      ),
    );
  }
  if (typeof filters.maxBPM === 'number') {
    result = result.filter(
      (sheet) => (
        sheet.bpm != null
        && sheet.bpm <= filters.maxBPM!
      ),
    );
  }
  if (filters.artist != null) {
    if (filters.matchExactArtist) {
      result = result.filter(
        (sheet) => (sheet.artist === filters.artist),
      );
    } else {
      const normalizedArtist = filters.artist.toLowerCase();
      result = result.filter(
        (sheet) => (
          sheet.artist != null
          && sheet.artist.toLowerCase().includes(normalizedArtist)
        ),
      );
    }
  }
  if (filters.noteDesigners.length !== 0) {
    const noteDesignerSet = new Set(filters.noteDesigners);
    result = result.filter(
      (sheet) => (
        noteDesignerSet.has(sheet.noteDesigner!)
      ),
    );
  }
  if (filters.superFilter != null) {
    try {
      const superFilter = parseSuperFilter(filters.superFilter);

      if (typeof superFilter !== 'function') throw new TypeError('Invalid super filter');

      try {
        result = result.filter(superFilter);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      }
    } catch {
      // do nothing if the super filter is invalid
    }
  }

  result = result.map((sheet) => getCanonicalSheet(sheet));

  return result;
}

export function loadFiltersFromQuery(query: Record<string, string>): Filters {
  const QueryReader = {
    boolean: (str: string) => parseBoolean(str) ?? null,
    string: (str: string) => String(str),
    number: (str: string) => Number(str),
    'string[]': (str: string) => str.split('|').map(QueryReader.string),
    'number[]': (str: string) => str.split('|').map(QueryReader.number),
  } as Record<string, (str: string) => any>;

  const filters = buildEmptyFilters() as Record<string, any>;

  for (const [key, name] of Object.entries(filterTypes)) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      filters[key] = QueryReader[name](query[key]);
    }
  }

  return filters as Filters;

  // Get the query from:
  // this.$route.query;
}

export function saveFiltersAsQuery(filters: Filters): Record<string, string> {
  const QueryWriter = {
    boolean: (value: boolean) => String(Boolean(value)),
    string: (value: string) => String(String(value)),
    number: (value: number) => String(Number(value)),
    'string[]': (values: string[]) => values.map(QueryWriter.string).join('|'),
    'number[]': (values: number[]) => values.map(QueryWriter.number).join('|'),
  } as Record<string, (value: any) => string>;

  const query = Object.create(null) as Record<string, string>;

  for (const [key, name] of Object.entries(filterTypes)) {
    const value = filters[key as keyof Filters];
    // eslint-disable-next-line no-continue
    if (value == null || isEmptyArray(value)) continue;
    query[key] = QueryWriter[name](value);
  }

  return query;

  // To apply the query:
  // this.$router.replace({ query }).catch(err => {
  //   ; // Ignore the error regarding navigating to the page they are already on.
  //   if (err.name !== 'NavigationDuplicated') throw err;
  // });
}
