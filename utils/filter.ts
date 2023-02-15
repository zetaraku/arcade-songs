import type { VueConstructor } from 'vue';
import type { Data, Sheet, Filters, FilterOptions } from '~/types';

const filterTypes = {
  categories: 'string[]',
  title: 'string',
  artist: 'string',

  versions: 'string[]',
  minBPM: 'number',
  maxBPM: 'number',

  types: 'string[]',
  difficulties: 'string[]',
  minLevelValue: 'number',
  maxLevelValue: 'number',
  useInternalLevel: 'boolean',

  noteDesigners: 'string[]',
  region: 'string',
};

export function buildEmptyFilters(): Filters {
  return {
    categories: [],
    title: null,
    artist: null,

    versions: [],
    minBPM: null,
    maxBPM: null,

    types: [],
    difficulties: [],
    minLevelValue: null,
    maxLevelValue: null,
    useInternalLevel: null,

    noteDesigners: [],
    region: null,
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

export function buildFilterOptions(data: Data, $t: InstanceType<VueConstructor>['$t']): FilterOptions {
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
          text: abbr ?? version,
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
          .filter((sheet) => sheet.levelValue != null && sheet.level != null)
          .map((sheet) => [sheet.levelValue!, sheet.level!])
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
          .map((sheet) => [sheet.internalLevelValue!, sheet.internalLevelValue!.toFixed(1)])
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
          text: $t('description.unavailableInRegion', { region: name }) as string,
          value: `!${region}`,
        },
      ]),
    ),
  };
}

export function filterSheets(sheets: Sheet[], filters: Filters) {
  let result = sheets.slice();

  if (filters.region != null) {
    if (filters.region.startsWith('!')) {
      const excludedRegion = filters.region.replace(/^!/, '');
      result = result.filter((sheet) => sheet.regions == null || !sheet.regions[excludedRegion]);
    } else {
      const includedRegion = filters.region;
      result = result.filter((sheet) => sheet.regions != null && sheet.regions[includedRegion]);
    }
  }
  if (filters.categories.length !== 0) {
    result = result.filter((sheet) => filters.categories.some(
      (category) => sheet.category === category || (sheet.category?.split('|').includes(category) ?? false),
    ));
  }
  if (filters.title != null) {
    const normalizedTitle = filters.title.toLowerCase();
    result = result.filter(
      (sheet) => sheet.title?.toLowerCase().includes(normalizedTitle) ?? false,
    );
  }
  if (filters.versions.length !== 0) {
    result = result.filter(
      (sheet) => filters.versions.includes(sheet.version!),
    );
  }
  if (filters.types.length !== 0) {
    result = result.filter(
      (sheet) => filters.types.includes(sheet.type!),
    );
  }
  if (filters.difficulties.length !== 0) {
    result = result.filter(
      (sheet) => filters.difficulties.includes(sheet.difficulty!),
    );
  }
  if (typeof filters.minLevelValue === 'number') {
    if (filters.useInternalLevel) {
      result = result.filter(
        (sheet) => sheet.internalLevelValue != null && sheet.internalLevelValue >= filters.minLevelValue!,
      );
    } else {
      result = result.filter(
        (sheet) => sheet.levelValue != null && sheet.levelValue >= filters.minLevelValue!,
      );
    }
  }
  if (typeof filters.maxLevelValue === 'number') {
    if (filters.useInternalLevel) {
      result = result.filter(
        (sheet) => sheet.internalLevelValue != null && sheet.internalLevelValue <= filters.maxLevelValue!,
      );
    } else {
      result = result.filter(
        (sheet) => sheet.levelValue != null && sheet.levelValue <= filters.maxLevelValue!,
      );
    }
  }
  if (typeof filters.minBPM === 'number') {
    result = result.filter(
      (sheet) => sheet.bpm != null && sheet.bpm >= filters.minBPM!,
    );
  }
  if (typeof filters.maxBPM === 'number') {
    result = result.filter(
      (sheet) => sheet.bpm != null && sheet.bpm <= filters.maxBPM!,
    );
  }
  if (filters.artist != null) {
    const normalizedArtist = filters.artist.toLowerCase();
    result = result.filter(
      (sheet) => sheet.artist?.toLowerCase().includes(normalizedArtist) ?? false,
    );
  }
  if (filters.noteDesigners.length !== 0) {
    result = result.filter(
      (sheet) => filters.noteDesigners.includes(sheet.noteDesigner!),
    );
  }

  return result;
}

export function loadFiltersFromQuery(query: Record<string, string>): Filters {
  const QueryReader = {
    boolean: (str: string) => (str === 'true' ? true : str === 'false' ? false : null),
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
    if (value == null || (Array.isArray(value) && value.length === 0)) continue;
    query[key] = QueryWriter[name](value);
  }

  return query;

  // To apply the query:
  // this.$router.replace({ query }).catch(err => {
  //   ; // Ignore the error regarding navigating to the page they are already on.
  //   if (err.name !== 'NavigationDuplicated') throw err;
  // });
}
