<script setup lang="ts">
import useDarkMode from '~/composables/useDarkMode';

const { isDarkMode } = useDarkMode();
</script>

<template>
  <v-btn
    icon
    @click.stop="isDarkMode = !isDarkMode"
  >
    <v-icon v-if="!isDarkMode">
      mdi-lightbulb-on-outline
    </v-icon>
    <v-icon v-else>
      mdi-weather-night
    </v-icon>
  </v-btn>
</template>
