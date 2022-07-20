import { ref, Ref } from '@nuxtjs/composition-api';
import sleep from 'sleep-promise';
import { pickItems, pickUniqueItems } from '~/utils';

export default class ItemDrawer<T> {
  drawingPool: T[];

  drawSize: number;

  drawWithReplacement: boolean;

  currentItems: Ref<(T | undefined)[]>;

  isDrawing: Ref<boolean>;

  #isStopping: boolean;

  #isRestarting: boolean;

  constructor({ drawingPool = [] as T[], drawSize = 1, drawWithReplacement = false } = {}) {
    this.drawingPool = drawingPool;
    this.drawSize = drawSize;
    this.drawWithReplacement = drawWithReplacement;
    this.currentItems = ref([]);

    this.isDrawing = ref(false);
    this.#isStopping = false;
    this.#isRestarting = false;

    this.resetCurrentItems();
  }

  resetCurrentItems() {
    this.currentItems.value = [...Array(this.drawSize)].fill(undefined);
  }

  setDrawingPool(items: T[]) {
    this.drawingPool = items;
  }

  setDrawSize(drawSize: number) {
    this.drawSize = drawSize;
    this.resetCurrentItems();
  }

  setDrawWithReplacement(drawWithReplacement: boolean) {
    this.drawWithReplacement = drawWithReplacement;
  }

  async startDrawing() {
    if (this.isDrawing.value) {
      this.#isRestarting = true;
      return false;
    }

    this.isDrawing.value = true;
    this.#isStopping = false;

    do {
      this.#isRestarting = false;

      if (this.drawingPool.length === 0) {
        this.currentItems.value = (
          this.drawWithReplacement
            ? []
            : [...Array(this.drawSize)].fill(undefined)
        );
        break;
      }
      if (this.drawingPool.length === 1) {
        this.currentItems.value = (
          this.drawWithReplacement
            ? [this.drawingPool[0]]
            : [...Array(this.drawSize)].fill(this.drawingPool[0])
        );
        break;
      }

      const tickDistance = 4000;
      const initialSpeed = 200;
      const speedDecrement = 5;

      for (let speed = initialSpeed; speed > 0; speed -= speedDecrement) {
        if (this.#isStopping || this.#isRestarting) break;

        this.currentItems.value = (
          this.drawWithReplacement
            ? pickUniqueItems(this.drawingPool, this.drawSize)
            : pickItems(this.drawingPool, this.drawSize)
        );

        // eslint-disable-next-line no-await-in-loop
        await sleep(tickDistance / speed);
      }
    } while (this.#isRestarting);

    this.isDrawing.value = false;

    return !this.#isStopping;
  }

  stopDrawing() {
    this.#isStopping = true;
  }

  setCurrentItems(items: T[]) {
    this.stopDrawing();
    this.currentItems.value = items;
  }
}
