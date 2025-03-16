export type Filters = {
  categories: string[];
  title: string | null;
  matchExactTitle: boolean | null;
  artist: string | null;
  matchExactArtist: boolean | null;

  versions: string[];
  minBPM: number | null;
  maxBPM: number | null;
  syncBPM: boolean | null;

  types: string[];
  difficulties: string[];
  minLevelValue: number | null;
  maxLevelValue: number | null;
  syncLevelValue: boolean | null;
  useInternalLevel: boolean | null;

  noteDesigners: string[];
  region: string | null;
  useRegionOverride: boolean | null;

  superFilter: string | null;
};
