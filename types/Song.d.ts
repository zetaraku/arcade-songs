import type { Sheet } from './Sheet';

export type Song = {
  category?: string;
  title?: string;
  artist?: string;
  imageName?: string;

  version?: string;
  releaseDate?: string;
  bpm?: number;
  isNew?: boolean;
  isLocked?: boolean;

  sheets: Sheet[];
} & {
  // added by preprocessing
  songNo: number;
  imageUrl?: string;
};
