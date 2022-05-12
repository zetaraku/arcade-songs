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

  sheets: (Song & {
    type?: string;
    difficulty?: string;
    level?: string;
    levelValue?: number;

    noteDesigner?: string;
    noteCounts?: Record<string, number>;
    regions?: Record<string, boolean>;
    isSpecial?: boolean;
  } & {
    // added by preprocessing
    notePercents?: Record<string, number>;
  })[];
} & {
  // added by preprocessing
  songNo: number;
  titleSerialNo: number;
  imageUrl?: string;
};

export type Sheet = Song['sheets'][number];

export type Data = {
  songs: Song[];

  categories: {
    category: string;
  }[];

  versions: {
    version: string;
    abbr?: string;
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

export interface Filters {
  categories: string[];
  title: string | null;
  artist: string | null;

  versions: string[];
  minBPM: number | null;
  maxBPM: number | null;

  type: string | null;
  difficulties: string[];
  minLevelValue: number | null;
  maxLevelValue: number | null;

  noteDesigners: string[];
  region: string | null;
}

export interface FilterOption<T> {
  text: string;
  value: T;
}

export interface FilterOptions {
  categories: FilterOption<string>[] | null;
  titles: string[] | null;
  artists: string[] | null;

  versions: FilterOption<string>[] | null;
  bpms: number[] | null;

  types: FilterOption<string>[] | null;
  difficulties: FilterOption<string>[] | null;
  levels: FilterOption<number>[] | null;

  noteDesigners: FilterOption<string>[] | null;
  regions: FilterOption<string>[] | null;
}
