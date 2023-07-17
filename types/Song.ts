import type { Sheet } from './Sheet';

export type Song = {
  songId: string | null;

  category?: string;
  title?: string;
  artist?: string;
  bpm?: number;

  imageName?: string;

  version?: string;
  releaseDate?: string;

  isNew?: boolean;
  isLocked?: boolean;

  sheets: Sheet[];
} & {
  // added by preprocessing
  songNo: number;
  imageUrl?: string;
  imageUrlM?: string;
};
