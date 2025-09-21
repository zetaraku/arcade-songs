import useVM from '~/composables/useVM';

export default function useGlobalComponents() {
  const vm = useVM()!;
  return vm.$options.components!;
}
