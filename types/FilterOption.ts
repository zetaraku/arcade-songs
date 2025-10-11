export type FilterOption<T> = {
  $type: 'header',
  header: string;
} | {
  $type: 'divider',
  divider: true;
} | {
  $type: 'option',
  text: string;
  value: T;
};
