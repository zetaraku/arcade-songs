<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { useMeta as useHead } from '@nuxtjs/composition-api';
import useVM from '~/composables/useVM';

const vm = useVM()!;

useHead(() => ({
  title: vm.$t('page-title.home') as string,
}));
</script>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'IndexPage',
  head: {},
});
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center">
      <v-col class="text-center">
        <v-icon :size="120" class="mb-5">
          mdi-music-box-multiple
        </v-icon>
        <h1 class="mb-5">
          arcade-songs
        </h1>
      </v-col>
    </v-row>
  </v-container>
</template>
