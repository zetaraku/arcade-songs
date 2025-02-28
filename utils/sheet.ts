import catImageUrl from '~/assets/images/cat.png';
import darkCatImageUrl from '~/assets/images/dark-cat.png';
import shyCatImageUrl from '~/assets/images/shy-cat.jpg';
import rickImageUrl from '~/assets/images/rick.png';
import indiImageUrl from '~/assets/images/indi.png';
import type { Sheet } from '~/types';

export const $canonicalSheet = Symbol('$canonicalSheet');

export const NULL_SHEET: Sheet = {
  songId: null,
  songNo: 0,

  category: '???',
  title: 'ฅ•ω•ฅ',
  artist: ':3',
  imageUrl: catImageUrl,

  version: undefined,
  bpm: undefined,

  type: '??',
  difficulty: '?',
  level: '',
  levelValue: 0,

  noteDesigner: undefined,
  comment: 'Oops! Nothing here :3',

  searchUrl: 'https://www.youtube.com/watch?v=W1nifh1OhI8',
};

export const VOID_SHEET: Sheet = {
  songId: null,
  songNo: -1,

  category: '???',
  title: 'ฅ-ω-ฅ',
  artist: ';3',
  imageUrl: darkCatImageUrl,

  version: undefined,
  bpm: undefined,

  type: '??',
  difficulty: '?',
  level: '',
  levelValue: 0,

  noteDesigner: undefined,
  comment: 'Oops! Nothing here ;3',

  searchUrl: 'https://www.youtube.com/watch?v=C9PFVo1FEwU',
};

export const RICK_SHEET: Sheet = {
  songId: null,
  songNo: -42,

  category: 'Whenever You Need Somebody',
  title: 'Never Gonna Give You Up',
  artist: 'Rick Astley',
  imageUrl: rickImageUrl,

  version: undefined,
  releaseDate: '1987-11-16',
  bpm: 113,

  type: '??',
  difficulty: '<:D',
  level: '',
  levelValue: 0,

  noteDesigner: undefined,
  comment: 'Never gonna give you up. Never gonna let you down.',

  searchUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

export const INDI_SHEET: Sheet = {
  songId: null,
  songNo: -43,

  category: 'IndiHome Packet Phoenix',
  title: 'Goyang Ubur Ubur (Remixed)',
  artist: 'Hendro Engkeng',
  imageUrl: indiImageUrl,

  version: undefined,
  releaseDate: '2020-04-??',
  bpm: 130,

  type: '??',
  difficulty: '<:D',
  level: '',
  levelValue: 0,

  noteDesigner: undefined,
  comment: 'IndiHome Paket Phoenix 100Mbps - Rp 935.000 / bulan',

  searchUrl: 'https://www.youtube.com/watch?v=_IneeB-UDFA',
};

export function getRegionOverrideSheet(sheet: Sheet, region: string): Sheet {
  return sheet.regionOverrides?.[region] ?? sheet;
}

export function getCanonicalSheet(sheet: Sheet): Sheet {
  return sheet[$canonicalSheet] ?? sheet;
}

export function isCanonicalSheet(sheet: Sheet): boolean {
  return sheet === getCanonicalSheet(sheet);
}

export function computeSheetExpr(sheet: Sheet) {
  return `${sheet.songId}|${sheet.type}|${sheet.difficulty}`;
}

export function makeInvalidDummySheet(sheetExprMatches: string[]): Sheet {
  const sheetExpr = sheetExprMatches.join('|');

  return {
    songId: null,
    songNo: 0,

    category: 'INVALID SHEET EXPR',
    title: sheetExpr,
    artist: undefined,
    bpm: undefined,

    imageName: undefined,
    imageUrl: undefined,

    version: undefined,
    releaseDate: undefined,

    type: '??',
    difficulty: 'invalid',

    level: undefined,
    levelValue: undefined,

    noteDesigner: undefined,
    comment: 'This sheet expr is not in a valid format.',

    searchUrl: null,
  };
}

export function makeUnmatchedDummySheet(sheetExprMatches: string[]): Sheet {
  const [songId, type, difficulty, level = undefined] = sheetExprMatches;

  return {
    songId,
    songNo: 0,

    category: 'UNMATCHED SHEET',
    title: songId,
    artist: undefined,
    bpm: undefined,

    imageName: undefined,
    imageUrl: undefined,

    version: undefined,
    releaseDate: undefined,

    type,
    difficulty,

    level,
    levelValue: undefined,

    noteDesigner: undefined,
    comment: 'This sheet expr doesn\'t match with any sheets.',

    searchUrl: null,
  };
}

export function makeDummySheet(sheetExpr: string): Sheet {
  // eslint-disable-next-line no-console
  console.warn(`Sheet for expr '${sheetExpr}' is not found.`);

  const sheetExprMatches = sheetExpr.split('|');

  if (sheetExprMatches.length < 3) return makeInvalidDummySheet(sheetExprMatches);
  return makeUnmatchedDummySheet(sheetExprMatches);
}

export function makeShyCatSheet(thing: unknown, category?: string): Sheet {
  const thingType = typeof thing;

  return {
    songId: null,
    songNo: 0,

    category,
    title: `you like ${thingType === 'string' ? thing : `${thingType}s`} don't you`,
    artist: 'Mauzymice',
    imageUrl: shyCatImageUrl,

    version: undefined,
    releaseDate: '2022-06-22',
    bpm: undefined,

    type: '??',
    difficulty: thingType,
    level: ['number', 'bigint', 'boolean', 'symbol', 'object'].includes(thingType) ? String(thing) : ':3',
    levelValue: 0,

    noteDesigner: undefined,
    comment: `oooooo you like returning ${thingType}s ur ${/^[aeiou]/i.test(thingType) ? 'an' : 'a'} ${thingType}lover`,

    searchUrl: null,
  };
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
  if (gameCode === 'chunithm') {
    return (
      sheet.noteCounts.total!
      - sheet.noteCounts.tap!
      - sheet.noteCounts.hold!
      - sheet.noteCounts.slide!
      - sheet.noteCounts.air!
      - sheet.noteCounts.flick!
    ) === 0;
  }

  return true;
}
