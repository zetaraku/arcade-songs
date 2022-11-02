import { makeDummySheet } from '~/utils/sheet';
import type { RawGallery, Gallery, Sheet } from '~/types';

// eslint-disable-next-line import/prefer-default-export
export function buildGallery(data: RawGallery, sheets: Sheet[]): Gallery {
  function getSheet(sheetExpr: string): Sheet {
    return sheets.find(
      (sheet) => sheet.sheetExpr === sheetExpr,
    ) ?? makeDummySheet(sheetExpr);
  }

  const lists = data;

  return lists.map((list) => ({
    ...list,
    sections: list.sections.map((section) => ({
      ...section,
      sheets: section.sheets?.map((sheetExpr) => getSheet(sheetExpr)),
    })),
  }));
}
