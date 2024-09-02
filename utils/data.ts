import { $canonicalSheet, computeSheetExpr, validateNoteCounts } from '~/utils/sheet';
import type { Data } from '~/types';

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

export function preprocessData(data: Data, dataSourceUrl: string, gameCode: string) {
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
    song.imageUrlM = resolveUrl(song.imageName, `${dataSourceUrl}/img/cover-m/`);

    for (const sheet of song.sheets) {
      Object.setPrototypeOf(sheet, song);

      sheet[$canonicalSheet] = sheet;

      sheet.imageUrl = resolveUrl(sheet.imageName, `${dataSourceUrl}/img/cover/`);
      sheet.imageUrlM = resolveUrl(sheet.imageName, `${dataSourceUrl}/img/cover-m/`);

      sheet.sheetExpr = computeSheetExpr(sheet);
      sheet.notePercents = computeNotePercentages(sheet.noteCounts);

      if (!validateNoteCounts(sheet, gameCode)) {
        // eslint-disable-next-line no-console
        console.warn('Invalid note counts:', sheet.sheetExpr, sheet.noteCounts);
      }

      for (const regionOverride of Object.values(sheet.regionOverrides ?? {})) {
        Object.setPrototypeOf(regionOverride, sheet);

        Object.freeze(regionOverride);
      }

      Object.freeze(sheet.noteCounts);
      Object.freeze(sheet.notePercents);
      Object.freeze(sheet.regions);
      Object.freeze(sheet.regionOverrides);

      Object.freeze(sheet);
    }

    Object.freeze(song.sheets);

    Object.freeze(song);
  }

  data.songs.reverse();

  // eslint-disable-next-line no-param-reassign
  data.sheets = data.songs.flatMap((song) => song.sheets);

  for (const category of data.categories) {
    Object.freeze(category);
  }
  for (const version of data.versions) {
    Object.freeze(version);
  }
  for (const type of data.types) {
    type.iconUrl = resolveUrl(type.iconUrl, `${dataSourceUrl}/img/`);
    Object.freeze(type);
  }
  for (const difficulty of data.difficulties) {
    difficulty.iconUrl = resolveUrl(difficulty.iconUrl!, `${dataSourceUrl}/img/`);
    Object.freeze(difficulty);
  }
  for (const region of data.regions) {
    Object.freeze(region);
  }

  Object.freeze(data.songs);
  Object.freeze(data.sheets);
  Object.freeze(data.categories);
  Object.freeze(data.versions);
  Object.freeze(data.types);
  Object.freeze(data.difficulties);
  Object.freeze(data.regions);

  Object.freeze(data);
}
