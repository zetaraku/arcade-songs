export function toLocalDateString(date: Date) {
  return new Intl.DateTimeFormat().format(date);
}

export function toLocalISOTimeString(date: Date) {
  const d = new Date(date.getTime());
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, -1);
}

export function toLocalISODateString(date: Date) {
  return toLocalISOTimeString(date).slice(0, 10);
}

export function toPercentageString(n: number | undefined) {
  if (n == null) return n;
  if (Number.isNaN(n)) return '?';
  return `${Math.trunc(10000 * n) / 100}%`;
}
