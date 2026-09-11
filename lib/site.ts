export const SITE_NAME = "Autohausia Logistic LLC";
export const SITE_URL = (process.env.SITE_URL ?? "").replace(/\/$/, "");

export function absoluteUrl(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return SITE_URL ? `${SITE_URL}${clean}` : clean;
}