export function cleanText(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, "").trim();
}