export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(min, n), max);
}
