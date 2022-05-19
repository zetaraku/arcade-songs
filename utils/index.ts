import type { VueConstructor } from 'vue';
import type { Data, Sheet, Filters, FilterOptions } from '~/types';

export class PageNotFoundError extends Error {
  statusCode = 404;

  constructor() {
    super('This page could not be found');
  }
}

export const NULL_SHEET: Sheet = {
  songNo: 0,
  sheetNo: 0,
  titleSerialNo: 0,

  category: '???',
  title: 'ฅ•ω•ฅ',
  artist: ':3',
  imageUrl: cat,

  version: undefined,
  bpm: 0,

  type: '??',
  difficulty: 'void',
  level: '0',
  levelValue: 0,

  noteDesigner: 'Oops! Nothing here :3',
  searchUrl: 'https://www.youtube.com/watch?v=W1nifh1OhI8',
};

export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function toLocalDateString(date: Date) {
  return new Intl.DateTimeFormat().format(date);
}
export function toLocalISOString(date: Date) {
  const d = new Date(date.getTime());
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, -1);
}
export function toPercentageString(n: number | undefined) {
  if (n == null) return n;
  if (Number.isNaN(n)) return '?';
  return `${Math.trunc(10000 * n) / 100}%`;
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
  const genTitleSerialNo = (() => {
    const titleCounts = new Map<string, number>();

    return (title: string) => {
      const lastTitleSerialNo = titleCounts.get(title) ?? 0;
      titleCounts.set(title, lastTitleSerialNo + 1);

      return lastTitleSerialNo + 1;
    };
  })();
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
  let lastSheetNo = 0;
  for (const song of data.songs) {
    lastSongNo += 1;
    song.songNo = lastSongNo;
    song.titleSerialNo = genTitleSerialNo(song.title!);
    song.imageUrl = resolveUrl(song.imageName, `${dataSourceUrl}/img/cover/`);

    for (const sheet of song.sheets) {
      Object.setPrototypeOf(sheet, song);

      lastSheetNo += 1;
      sheet.sheetNo = lastSheetNo;
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

    type: null,
    difficulties: [],
    minLevelValue: null,
    maxLevelValue: null,

    noteDesigners: [],
    region: null,
  };
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
      (category) => sheet.category != null && sheet.category.split('|').includes(category),
    ));
  }
  if (filters.title != null) {
    const normalizedTitle = filters.title.toLowerCase();
    result = result.filter(
      (sheet) => sheet.title != null && sheet.title.toLowerCase().includes(normalizedTitle),
    );
  }
  if (filters.versions.length !== 0) {
    result = result.filter(
      (sheet) => sheet.version != null && filters.versions.includes(sheet.version),
    );
  }
  if (filters.type != null) {
    result = result.filter(
      (sheet) => sheet.type != null && sheet.type === filters.type,
    );
  }
  if (filters.difficulties.length !== 0) {
    result = result.filter(
      (sheet) => sheet.difficulty != null && filters.difficulties.includes(sheet.difficulty),
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
      (sheet) => sheet.artist != null && sheet.artist.toLowerCase().includes(normalizedArtist),
    );
  }
  if (filters.noteDesigners.length !== 0) {
    result = result.filter(
      (sheet) => sheet.noteDesigner != null && filters.noteDesigners.includes(sheet.noteDesigner),
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
