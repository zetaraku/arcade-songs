<script setup lang="ts">
import { computed } from '@nuxtjs/composition-api';
import useI18n from '~/composables/useI18n';
import useGtag from '~/composables/useGtag';
import useGameInfo from '~/composables/useGameInfo';
import type { LocaleObject } from '@nuxtjs/i18n';

const i18n = useI18n();
const gtag = useGtag();
const { gameCode } = useGameInfo();

const currentLocaleOption = computed(() => i18n.localeProperties);
const localeOptions = computed(() => i18n.locales as LocaleObject[]);

function setLocale(locale: string) {
  i18n.setLocale(locale);
  gtag('event', 'LocaleChanged', { gameCode: gameCode.value, eventSource: 'LocaleSwitcher', locale });
}
</script>

<template>
  <v-menu offset-y>
    <template #activator="{ on }">
      <v-btn
        text
        v-on="on"
      >
        <v-icon left>
          mdi-web
        </v-icon>
        <span
          class="d-inline d-sm-none"
          v-text="currentLocaleOption.abbr"
        />
        <span
          class="d-none d-sm-inline"
          v-text="currentLocaleOption.name"
        />
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="localeOption in localeOptions"
        :key="localeOption.code"
        @click="setLocale(localeOption.code);"
      >
        <v-list-item-title>
          {{ localeOption.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
