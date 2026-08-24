import { BASE_PATH } from "./basepath";

export function apiUrl(path: string) {
  // pastiin gak dobel slash kalau path udah diawali "/"
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}