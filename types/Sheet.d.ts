import type { Song } from './Song';

export type Sheet = (Omit<Song, 'sheets'> & {
  type?: string;
  difficulty?: string;
  level?: string;
  levelValue?: number;
  internalLevel?: string;
  internalLevelValue?: number;

  noteDesigner?: string;
  noteCounts?: Record<string, number | null>;
  regions?: Record<string, boolean>;
  isSpecial?: boolean;
} & {
  // added by preprocessing
  sheetExpr?: string;
  notePercents?: Record<string, number | null>;

  // used by sheet placeholders
  searchUrl?: string | null;
});
