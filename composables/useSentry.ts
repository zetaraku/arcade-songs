import useVM from '~/composables/useVM';

export default function useSentry() {
  const vm = useVM()!;
  return vm.$sentry;
}
