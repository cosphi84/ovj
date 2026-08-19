export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function apiUrl(path: string) {
  // pastiin gak dobel slash kalau path udah diawali "/"
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}