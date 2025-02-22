<script setup lang="ts">
import { ref, computed, watchEffect } from '@nuxtjs/composition-api';
import useDarkMode from '~/composables/useDarkMode';
import useGameInfo from '~/composables/useGameInfo';
import sites from '~/data/sites.json';
import { parseSuperFilter } from '~/utils';

const props = defineProps<{
  value: boolean;
  superFilterText: string;
}>();
// eslint-disable-next-line no-spaced-func, func-call-spacing
defineEmits<{
  (event: 'input', value: boolean): void;
  (event: 'update:superFilterText', value: string): void;
}>();

const { isDarkMode } = useDarkMode();
const { gameCode } = useGameInfo();

const currentSuperFilterText = ref('');

const dataSourceUrl = computed(
  () => sites.find((site) => site.gameCode === gameCode.value)?.dataSourceUrl,
);

function validateSuperFilter(superFilterText: string): boolean | string {
  try {
    const superFilter = parseSuperFilter(superFilterText);

    if (typeof superFilter !== 'function') throw new TypeError('You should return a predicate function.');

    return true;
  } catch (err) {
    return String(err);
  }
}

watchEffect(() => {
  if (props.value) {
    currentSuperFilterText.value = props.superFilterText;
  }
});
</script>

<template>
  <v-dialog
    :value="value"
    max-width="600px"
    scrollable
    :overlay-color="isDarkMode ? '#FFF8' : undefined"
    @input="$emit('input', $event);"
  >
    <v-card>
      <v-card-title>
        <v-icon left>
          mdi-code-braces-box
        </v-icon>
        <span>
          {{ $t('term.superFilter') }} (JavaScript)
        </span>
      </v-card-title>
      <v-card-text class="py-0">
        <fieldset class="rounded pb-1 mb-4">
          <legend class="px-1 ml-2">
            <v-icon small>
              mdi-information-outline
            </v-icon>
            <span>Instructions</span>
          </legend>
          <ul>
            <li>
              <code>sheet</code>
              is of type
              <a href="https://github.com/zetaraku/arcade-songs/blob/master/types/Sheet.ts" target="_blank"><code>Sheet</code></a>
              and has all properties of the
              <a href="https://github.com/zetaraku/arcade-songs/blob/master/types/Song.ts" target="_blank"><code>Song</code></a>
              it belongs to.
            </li>
            <li>
              You can also refer to the
              <code>songs</code>
              property in the
              <a :href="`${dataSourceUrl}/data.json`" target="_blank">Current Data Source</a>.
            </li>
            <li>
              👉 <a href="https://gist.github.com/zetaraku/e2dab92b65ca2e0166f61f44fca16547" target="_blank">Examples</a>
            </li>
            <li>
              <b>DO NOT paste any code that you cannot trust or understand!</b>
            </li>
          </ul>
        </fieldset>
        <v-textarea
          v-model="currentSuperFilterText"
          rows="5"
          :rules="[validateSuperFilter]"
          label="function getSuperFilter() {"
          :placeholder="$t('description.superFilterPlaceholder')"
          :hint="$t('description.superFilterHint')"
          persistent-placeholder
          outlined
          auto-grow
          style="font-family: Consolas, monospace;"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="secondary"
          @click="$emit('input', false);"
        >
          {{ $t('ui.cancel') }}
        </v-btn>
        <v-btn
          text
          color="success"
          @click="
            $emit('update:superFilterText', currentSuperFilterText);
            $emit('input', false);
          "
        >
          {{ $t('ui.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
