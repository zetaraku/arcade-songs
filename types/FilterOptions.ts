import type { FilterOption } from './FilterOption';

export type FilterOptions = {
  categories: FilterOption<string>[] | null;
  titles: string[] | null;
  artists: string[] | null;

  versions: FilterOption<string>[] | null;
  bpms: number[] | null;

  types: FilterOption<string>[] | null;
  difficulties: FilterOption<string>[] | null;
  levels: FilterOption<number>[] | null;
  internalLevels: FilterOption<number>[] | null;

  noteDesigners: FilterOption<string>[] | null;
  regions: FilterOption<string>[] | null;
};
