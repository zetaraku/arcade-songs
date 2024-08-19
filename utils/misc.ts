export function isValidUrl(urlString: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

export function parseBoolean(str: string): boolean | undefined {
  if (str === 'true') return true;
  if (str === 'false') return false;
  return undefined;
}
