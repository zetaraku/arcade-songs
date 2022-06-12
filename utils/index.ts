import type { VueConstructor } from 'vue';
import type { Data, Sheet, Filters, FilterOptions } from '~/types';
import cat from '~/assets/cat.png';
import rick from '~/assets/rick.png';

export class PageNotFoundError extends Error {
  statusCode = 404;

  constructor() {
    super('This page could not be found');
  }
}

export const NULL_SHEET: Sheet = {
  songId: null,
  songNo: 0,

  category: '???',
  title: 'ฅ•ω•ฅ',
  artist: ':3',
  imageUrl: cat,

  version: undefined,
  bpm: undefined,

  type: '??',
  difficulty: '?',
  level: '',
  levelValue: 0,

  noteDesigner: 'Oops! Nothing here :3',
  searchUrl: 'https://www.youtube.com/watch?v=W1nifh1OhI8',
};

export const RICK_SHEET: Sheet = {
  songId: null,
  songNo: -1,

  category: 'Whenever You Need Somebody',
  title: 'Never Gonna Give You Up',
  artist: 'Rick Astley',
  imageUrl: rick,

  version: undefined,
  releaseDate: '1987-11-16',
  bpm: 113,

  type: '??',
  difficulty: '<:D',
  level: '',
  levelValue: 0,

  noteDesigner: 'Never gonna give you up. Never gonna let you down.',
  searchUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function toLocalDateString(date: Date) {
  return new Intl.DateTimeFormat().format(date);
}
export function toLocalISOTimeString(date: Date) {
  const d = new Date(date.getTime());
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, -1);
}
export function toLocalISODateString(date: Date) {
  return toLocalISOTimeString(date).slice(0, 10);
}

export function toPercentageString(n: number | undefined) {
  if (n == null) return n;
  if (Number.isNaN(n)) return '?';
  return `${Math.trunc(10000 * n) / 100}%`;
}

export function computeSheetExpr(sheet: Sheet) {
  return `${sheet.songId}|${sheet.type}-${sheet.difficulty}`;
}

export function makeDummySheet(sheetExpr: string): Sheet {
  const match = sheetExpr.match(/^(.*)\|(\w*)-(\w*)$/);

  // eslint-disable-next-line no-console
  console.warn(`Sheet for expr '${sheetExpr}' is not found.`);

  if (match === null) {
    return {
      songId: null,
      songNo: 0,

      category: 'INVALID SHEET EXPR',
      title: sheetExpr,
      artist: undefined,
      imageUrl: undefined,

      version: undefined,
      bpm: undefined,

      type: '??',
      difficulty: 'invalid',
      level: undefined,
      levelValue: undefined,

      noteDesigner: 'This sheet expr is not in a valid format.',
      searchUrl: null,
    };
  }

  const [, title, type, difficulty] = match;
  return {
    songId: null,
    songNo: 0,

    category: 'UNMATCHED SHEET',
    title,
    artist: undefined,
    imageUrl: undefined,

    version: undefined,
    bpm: undefined,

    type,
    difficulty,
    level: undefined,
    levelValue: undefined,

    noteDesigner: 'This sheet expr doesn\'t match with any sheets.',
    searchUrl: null,
  };
}

export function buildEmptyData(): Data {
  return {
    songs: [],
    sheets: [],

    categories: [],

    versions: [],

    types: [],
    difficulties: [],

    regions: [],

    // mark the data as empty
    updateTime: '0000-00-00',
  };
}

export function preprocessData(data: Data, dataSourceUrl: string) {
  function resolveUrl(filePath: string | undefined, baseUrl: string) {
    return filePath != null ? new URL(filePath, baseUrl).toString() : filePath;
  }
  function computeNotePercentages(noteCounts: Record<string, number | null> | undefined) {
    return noteCounts != null ? Object.fromEntries(
      Object.entries(noteCounts)
        .map(([key, value]) => [
          key,
          value != null && noteCounts.total != null ? Number(value) / noteCounts.total : null,
        ]),
    ) : noteCounts;
  }

  let lastSongNo = 0;
  for (const song of data.songs) {
    lastSongNo += 1;
    song.songNo = lastSongNo;
    song.imageUrl = resolveUrl(song.imageName, `${dataSourceUrl}/img/cover/`);

    for (const sheet of song.sheets) {
      Object.setPrototypeOf(sheet, song);

      sheet.sheetExpr = computeSheetExpr(sheet);
      sheet.notePercents = computeNotePercentages(sheet.noteCounts);
    }
  }

  data.songs.reverse();
  // eslint-disable-next-line no-param-reassign
  data.sheets = data.songs.flatMap((song) => song.sheets);

  for (const type of data.types) {
    type.iconUrl = resolveUrl(type.iconUrl, `${dataSourceUrl}/img/`);
  }
  for (const difficulty of data.difficulties) {
    difficulty.iconUrl = resolveUrl(difficulty.iconUrl!, `${dataSourceUrl}/img/`);
  }
}

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

    noteDesigners: [],
    region: null,
  };
}

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

  noteDesigners: 'string[]',
  region: 'string',
};

export function loadFiltersFromQuery(query: Record<string, string>): Filters {
  const QueryReader = {
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

export function buildFilterOptions(data: Data, $t: InstanceType<VueConstructor>['$t']): FilterOptions {
  if (data.updateTime === '0000-00-00') {
    // return empty array instead of null to preserve all filters ui before the data is loaded
    return {
      categories: [],
      titles: [],
      artists: [],

      versions: [],
      bpms: [],

      types: [],
      difficulties: [],
      levels: [],

      noteDesigners: [],
      regions: [],
    };
  }

  const nonEmptyOrNull = <T>(arr: T[]) => (arr.length !== 0 ? arr : null);

  return {
    categories: nonEmptyOrNull(
      data.categories
        .map(({ category }) => ({
          text: category,
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
      [...new Map(data.sheets.map((sheet) => [sheet.levelValue!, sheet.level!])).entries()]
        .filter(([levelValue, level]) => levelValue != null && level != null)
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
    result = result.filter(
      (sheet) => sheet.levelValue != null && sheet.levelValue >= filters.minLevelValue!,
    );
  }
  if (typeof filters.maxLevelValue === 'number') {
    result = result.filter(
      (sheet) => sheet.levelValue != null && sheet.levelValue <= filters.maxLevelValue!,
    );
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

export function validateNoteCounts(sheet: Sheet, gameCode: string | undefined) {
  if (sheet.noteCounts == null) return true;

  if (gameCode === 'maimai') {
    return (
      sheet.noteCounts.total!
      - sheet.noteCounts.tap!
      - sheet.noteCounts.hold!
      - sheet.noteCounts.slide!
      - sheet.noteCounts.touch!
      - sheet.noteCounts.break!
    ) === 0;
  }

  return true;
}

export function shuffled<T>(items: T[], maxCount = items.length) {
  const itemsCopy = items.slice();

  for (let i = 0; i < itemsCopy.length; i += 1) {
    if (i + 1 > maxCount) break;

    const j = i + Math.floor((itemsCopy.length - i) * Math.random());
    [itemsCopy[i], itemsCopy[j]] = [itemsCopy[j], itemsCopy[i]];
  }

  return itemsCopy;
}
export function pickItem<T>(items: T[]) {
  return items[Math.floor(items.length * Math.random())];
}
export function pickItems<T>(items: T[], count: number) {
  return [...Array(count)].map(() => pickItem(items));
}
export function pickUniqueItems<T>(items: T[], maxCount: number) {
  return shuffled(items, maxCount).slice(0, maxCount);
}
