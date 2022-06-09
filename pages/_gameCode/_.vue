<script setup lang="ts">
//! This file is explicitly added to ensure gameCode is properly set for 404 page within this route.
import { useContext } from '@nuxtjs/composition-api';
import { PageNotFoundError } from '~/utils';

const context = useContext();

context.error(new PageNotFoundError());
</script>

<template>
  <div />
</template>
