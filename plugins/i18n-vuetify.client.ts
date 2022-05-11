import { defineNuxtPlugin } from '@nuxtjs/composition-api';

export default defineNuxtPlugin((ctx) => {
  ctx.app.vuetify!.framework.lang.current = ctx.app.i18n.locale;

  ctx.app.i18n.onLanguageSwitched = (_oldLocale: string, newLocale: string) => {
    ctx.app.vuetify!.framework.lang.current = newLocale;
  };
});
