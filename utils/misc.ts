export function isValidUrl(urlString: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

export function isEmptyArray(arg: unknown): boolean {
  return Array.isArray(arg) && arg.length === 0;
}

export function parseBoolean(str: string): boolean | undefined {
  if (str === 'true') return true;
  if (str === 'false') return false;
  return undefined;
}
