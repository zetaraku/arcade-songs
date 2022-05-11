<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { computed, useMeta as useHead } from '@nuxtjs/composition-api';
import useVM from '~/composables/useVM';
import useGameCode from '~/composables/useGameCode';

const props = defineProps<{
  error: Record<string, any>;
}>();

const vm = useVM()!;
const { gameCode } = useGameCode();

const isNotFound = computed(() => props.error.statusCode === 404);
const title = computed(() => (isNotFound.value ? 'Not Found' : 'Error'));
const heading = computed(() => (isNotFound.value ? vm.$t('page.error.notFound') : vm.$t('page.error.error')) as string);

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
    <v-row align="center">
      <v-col class="text-center">
        <v-icon :size="120" class="mb-5">
          mdi-alert-circle-outline
        </v-icon>
        <h1 class="mb-5">
          {{ heading }}
        </h1>
        <p class="red--text mb-5">
          {{ error.message }}
        </p>

        <div class="mt-10">
          <v-btn
            v-if="!isNotFound"
            outlined
            large
            href="https://github.com/zetaraku/arcade-songs/issues"
            target="_blank"
            color="error"
            class="mr-5"
          >
            Report Bug
          </v-btn>
          <v-btn
            outlined
            large
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
