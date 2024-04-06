import { ref, unref, watch, readonly, Ref } from '@nuxtjs/composition-api';
import { until, MaybeRef } from '@vueuse/core';
import sleep from 'sleep-promise';
import { pickItems, pickUniqueItems } from '~/utils';

export default function useItemDrawer<T>({
  drawingPool = [],
  drawSize = 1,
  drawWithReplacement = false,
}: {
  drawingPool?: MaybeRef<T[]>,
  drawSize?: MaybeRef<number>,
  drawWithReplacement?: MaybeRef<boolean>,
} = {}) {
  const currentItems = ref([]) as Ref<(T | undefined)[]>;

  const isDrawing = ref(false);
  const isStopping = ref(false);
  const isRestarting = ref(false);

  async function startDrawing(onFinish?: (resultItems: typeof currentItems.value) => void) {
    // request for restarting if already drawing
    if (isDrawing.value) {
      isRestarting.value = true;
      return;
    }

    isDrawing.value = true;
    isStopping.value = false;

    do {
      isRestarting.value = false;

      const pool = unref(drawingPool);
      const size = unref(drawSize);
      const replacement = unref(drawWithReplacement);

      // early stop
      if (pool.length === 0) {
        currentItems.value = (!replacement ? [...Array(size)].fill(undefined) : []);
        break;
      }
      if (pool.length === 1) {
        currentItems.value = (!replacement ? [...Array(size)].fill(pool[0]) : [pool[0]]);
        break;
      }

      const tickDistance = 4000;
      const initialSpeed = 200;
      const speedDecrement = 5;

      for (let speed = initialSpeed; speed > 0; speed -= speedDecrement) {
        if (isRestarting.value || isStopping.value) break;

        currentItems.value = (!replacement ? pickItems(pool, size) : pickUniqueItems(pool, size));

        // eslint-disable-next-line no-await-in-loop
        await sleep(tickDistance / speed);
      }
    } while (isRestarting.value);

    if (!isStopping.value) onFinish?.(currentItems.value);

    isDrawing.value = false;
    isStopping.value = false;
    isRestarting.value = false;
  }

  async function stopDrawing() {
    isStopping.value = true;
    await until(isDrawing).toBe(false);
  }

  function setCurrentItems(items: (T | undefined)[]) {
    stopDrawing();
    currentItems.value = items;
  }

  function resetCurrentItems() {
    const pool = unref(drawingPool);
    const size = unref(drawSize);
    const replacement = unref(drawWithReplacement);

    const fillSize = (!replacement ? size : Math.min(size, pool.length));

    stopDrawing();
    currentItems.value = [...Array(fillSize)].fill(undefined);
  }

  watch([ref(drawingPool), ref(drawSize), ref(drawWithReplacement)], () => {
    resetCurrentItems();
  }, { immediate: true, flush: 'sync' });

  return {
    currentItems: readonly(currentItems),
    isDrawing: readonly(isDrawing),

    startDrawing,
    stopDrawing,
    setCurrentItems,
    resetCurrentItems,
  };
}
