import useVM from '~/composables/useVM';

export default function useGtag() {
  const vm = useVM();
  return (vm as any).$gtag;
}
