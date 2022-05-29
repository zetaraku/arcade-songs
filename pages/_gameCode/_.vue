<script setup lang="ts">
//! This file is explicitly added to ensure gameCode is properly set for 404 page within this route.
import useVM from '~/composables/useVM';
import { PageNotFoundError } from '~/utils';

const vm = useVM();

vm.$nuxt.error(new PageNotFoundError());
</script>

<template>
  <div />
</template>
