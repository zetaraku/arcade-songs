<script setup lang="ts">
import { inject, WritableComputedRef } from '@nuxtjs/composition-api';

const isDarkMode: WritableComputedRef<boolean> = inject('isDarkMode')!;
</script>

<template>
  <v-btn
    icon
    @click.stop="isDarkMode = !isDarkMode;"
  >
    <v-icon v-if="!isDarkMode">
      mdi-lightbulb-on-outline
    </v-icon>
    <v-icon v-else>
      mdi-weather-night
    </v-icon>
  </v-btn>
</template>
