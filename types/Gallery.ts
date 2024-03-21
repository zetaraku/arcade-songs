import { Sheet } from './Sheet';

export type GallerySection = {
  title?: string;
  description?: string;
  sheets?: Sheet[];
  sheetDescriptions?: string[];
};

export type GalleryList = {
  title: string;
  id?: string;
  description?: string;
  sections: GallerySection[];
  isHidden?: boolean;
};

export type Gallery = GalleryList[];
