<script setup lang="ts">
import { computed, useContext } from '@nuxtjs/composition-api';
import type { LocaleObject } from '@nuxtjs/i18n';

const context = useContext();

const currentLocaleOption = computed(() => context.i18n.localeProperties);
const localeOptions = computed(() => context.i18n.locales as LocaleObject[]);

function setLocale(locale: string) {
  context.i18n.setLocale(locale);
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
        <v-list-item-title v-text="localeOption.name" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>
