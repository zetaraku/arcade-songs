<script setup lang="ts">
import { computed } from '@nuxtjs/composition-api';
import useVM from '~/composables/useVM';
import type { LocaleObject } from '@nuxtjs/i18n';

const vm = useVM();

const currentLocaleOption = computed(() => vm.$i18n.localeProperties);
const localeOptions = computed(() => vm.$i18n.locales as LocaleObject[]);

function setLocale(locale: string) {
  vm.$i18n.setLocale(locale);
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
        @click.stop="setLocale(localeOption.code);"
      >
        <v-list-item-title v-text="localeOption.name" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>
