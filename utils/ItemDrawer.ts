import { ref, Ref } from '@nuxtjs/composition-api';
import sleep from 'sleep-promise';
import { pickItems } from '~/utils';

export default class ItemDrawer<T> {
  #drawingPool: T[];

  #drawSize: number;

  currentItems: Ref<(T | undefined)[]>;

  isDrawing: Ref<boolean>;

  #isStopping: boolean;

  #isRestarting: boolean;

  constructor({ drawingPool = [] as T[], drawSize = 1 } = {}) {
    this.#drawingPool = drawingPool;
    this.#drawSize = drawSize;
    this.currentItems = ref([...Array(drawSize)].fill(undefined));

    this.isDrawing = ref(false);
    this.#isStopping = false;
    this.#isRestarting = false;
  }

  setDrawingPool(items: T[]) {
    this.#drawingPool = items;
  }

  setDrawSize(drawSize: number) {
    this.#drawSize = drawSize;
    this.currentItems.value = [...Array(drawSize)].fill(undefined);
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

      if (this.#drawingPool.length === 0) {
        this.currentItems.value = [...Array(this.#drawSize)].fill(undefined);
        break;
      }
      if (this.#drawingPool.length === 1) {
        this.currentItems.value = [...Array(this.#drawSize)].fill(this.#drawingPool[0]);
        break;
      }

      const tickDistance = 4000;
      const initialSpeed = 200;
      const speedDecrement = 5;

      for (let speed = initialSpeed; speed > 0; speed -= speedDecrement) {
        if (this.#isStopping || this.#isRestarting) break;

        this.currentItems.value = pickItems(this.#drawingPool, this.#drawSize);

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
