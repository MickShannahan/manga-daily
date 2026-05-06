/** Strips diacritics and lowercases so e.g. "shonen" matches "Shōnen" */
export function normalizeGuess(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}
