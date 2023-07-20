import catImageUrl from '~/assets/images/cat.png';
import rickImageUrl from '~/assets/images/rick.png';
import type { Sheet } from '~/types';

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

  noteDesigner: 'Oops! Nothing here :3',
  searchUrl: 'https://www.youtube.com/watch?v=W1nifh1OhI8',
};

export const RICK_SHEET: Sheet = {
  songId: null,
  songNo: -1,

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

  noteDesigner: 'Never gonna give you up. Never gonna let you down.',
  searchUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

export function computeSheetExpr(sheet: Sheet) {
  return `${sheet.songId}|${sheet.type}|${sheet.difficulty}`;
}

export function makeInvalidDummySheet(sheetExprMatches: string[]) {
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

    noteDesigner: 'This sheet expr is not in a valid format.',

    searchUrl: null,
  };
}

export function makeUnmatchedDummySheet(sheetExprMatches: string[]) {
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

    noteDesigner: 'This sheet expr doesn\'t match with any sheets.',

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
