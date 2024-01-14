import type { LocaleObject } from '@nuxtjs/i18n';

const locales: LocaleObject[] = [
  {
    code: 'en', iso: 'en', abbr: 'en', name: 'English', file: 'en.yaml',
  },
  {
    code: 'es', iso: 'es', abbr: 'es', name: 'Español', file: 'es.yaml',
  },
  {
    code: 'ru', iso: 'ru', abbr: 'ru', name: 'Русский', file: 'ru.yaml',
  },
  {
    code: 'id', iso: 'id', abbr: 'id', name: 'Bahasa Indonesia', file: 'id.yaml',
  },
  {
    code: 'ja', iso: 'ja', abbr: 'ja', name: '日本語', file: 'ja.yaml',
  },
  {
    code: 'ko', iso: 'ko', abbr: 'ko', name: '한국어', file: 'ko.yaml',
  },
  {
    code: 'zh-Hant', iso: 'zh-Hant', abbr: 'tc', name: '正體中文', file: 'zh-Hant.yaml',
  },
  {
    code: 'zh-Hans', iso: 'zh-Hans', abbr: 'sc', name: '简体中文', file: 'zh-Hans.yaml',
  },
];

export default locales;
