import { getCurrentInstance } from '@nuxtjs/composition-api';

export default function useVM() {
  return getCurrentInstance()?.proxy;
}
