import type { LocaleObject } from '@nuxtjs/i18n';

const locales: LocaleObject[] = [
  {
    // English
    code: 'en', iso: 'en', abbr: 'en', name: 'English', file: 'en.yaml',
  },
  {
    // Spanish
    code: 'es', iso: 'es', abbr: 'es', name: 'Español', file: 'es.yaml',
  },
  {
    // Russian
    code: 'ru', iso: 'ru', abbr: 'ru', name: 'Русский', file: 'ru.yaml',
  },
  {
    // Indonesian
    code: 'id', iso: 'id', abbr: 'id', name: 'Bahasa Indonesia', file: 'id.yaml',
  },
  {
    // Japanese
    code: 'ja', iso: 'ja', abbr: 'ja', name: '日本語', file: 'ja.yaml',
  },
  {
    // Korean
    code: 'ko', iso: 'ko', abbr: 'ko', name: '한국어', file: 'ko.yaml',
  },
  {
    // Traditional Chinese
    code: 'zh-Hant', iso: 'zh-Hant', abbr: 'tc', name: '正體中文', file: 'zh-Hant.yaml',
  },
  {
    // Simplified Chinese
    code: 'zh-Hans', iso: 'zh-Hans', abbr: 'sc', name: '简体中文', file: 'zh-Hans.yaml',
  },
];

export default locales;
