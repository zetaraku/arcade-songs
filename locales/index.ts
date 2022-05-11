import type { LocaleObject } from '@nuxtjs/i18n';

export default [
  {
    code: 'en', iso: 'en', abbr: 'en', name: 'English', file: 'en.yaml',
  },
  {
    code: 'ja', iso: 'ja', abbr: 'ja', name: '日本語', file: 'ja.yaml',
  },
  {
    code: 'zh-Hant', iso: 'zh-Hant', abbr: 'tc', name: '正體中文', file: 'zh-Hant.yaml',
  },
  {
    code: 'zh-Hans', iso: 'zh-Hans', abbr: 'sc', name: '简体中文', file: 'zh-Hans.yaml',
  },
] as LocaleObject[];
