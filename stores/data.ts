import { defineStore } from 'pinia';

export default defineStore('data', {
  state: () => ({
    message: 'Hello store!',
  }),
});
