export type RawGallerySection = {
  title?: string;
  description?: string;
  sheets?: string[];
  sheetDescriptions?: string[];
};

export type RawGalleryList = {
  title: string;
  id?: string;
  description?: string;
  sections: RawGallerySection[];
  isHidden?: boolean;
};

export type RawGallery = RawGalleryList[];
