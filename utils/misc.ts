// eslint-disable-next-line import/prefer-default-export
export function isValidUrl(urlString: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}
