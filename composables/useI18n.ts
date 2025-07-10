import { useContext } from '@nuxtjs/composition-api';

export default function useI18n() {
  const context = useContext();

  return context.i18n;
}
