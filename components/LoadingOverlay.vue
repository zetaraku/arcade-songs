<template>
  <v-overlay>
    <div class="text-center">
      <v-progress-circular indeterminate :size="64" />
      <v-spacer class="pa-3" />
      <span>
        {{ $t('description.loading') }}
      </span>
    </div>
  </v-overlay>
</template>
