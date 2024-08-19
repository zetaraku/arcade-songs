<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { computed, useMeta as useHead, useContext } from '@nuxtjs/composition-api';
import useGameInfo from '~/composables/useGameInfo';

const props = defineProps<{
  error: Record<string, any>;
}>();

const context = useContext();
const { gameCode } = useGameInfo();

const isNotFound = computed(() => props.error.statusCode === 404);
const title = computed(() => (isNotFound.value ? context.i18n.t('page.error.notFound') : context.i18n.t('page.error.error')) as string);

useHead(() => ({
  title: title.value,
}));
</script>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'ErrorPage',
  head: {},
});
</script>

<template>
  <v-container class="fill-height">
    <v-row class="align-center">
      <v-col class="text-center">
        <v-icon :size="120" class="mb-5">
          mdi-alert-circle-outline
        </v-icon>

        <h1 class="mb-5">
          <span v-text="title" />
        </h1>
        <p
          class="red--text"
          v-text="error.message"
        />

        <div class="mt-10">
          <v-btn
            v-if="!isNotFound"
            outlined
            large
            color="error"
            :href="$config.siteReportUrl"
            target="_blank"
            class="mr-5"
          >
            {{ $t('page-title.bug-report') }}
          </v-btn>
          <v-btn
            outlined
            large
            color="secondary"
            :to="gameCode !== undefined ? `/${gameCode}/` : '/'"
            exact
          >
            {{ $t('page.error.backToHome') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
