import type { Song } from './Song';
import type { Sheet } from './Sheet';

export type Data = {
  songs: Song[];

  categories: {
    category: string;
  }[];

  versions: {
    version: string;
    abbr?: string;
    releaseDate?: string;
  }[];

  types: {
    type: string;
    name: string;
    abbr?: string;
    iconUrl?: string;
    iconHeight?: number;
  }[];
  difficulties: {
    difficulty: string;
    name: string;
    color?: string;
    iconUrl?: string;
    iconHeight?: number;
  }[];

  regions: {
    region: string;
    name: string;
  }[];

  updateTime: string;
} & {
  // added by preprocessing
  sheets: Sheet[];
};
