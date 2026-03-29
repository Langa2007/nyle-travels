const DEFAULT_PUBLIC_API_URL = '/api/proxy';

export const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || DEFAULT_PUBLIC_API_URL).replace(/\/+$/, '') ||
  DEFAULT_PUBLIC_API_URL;

export function buildApiUrl(path = '') {
  if (!path) {
    return API_URL;
  }

  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
