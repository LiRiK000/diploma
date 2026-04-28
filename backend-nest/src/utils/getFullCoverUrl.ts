import { getPublicFileBaseUrl } from '../common/file/file-storage.config';

export function getFullUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  const cleanBase = getPublicFileBaseUrl().replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '').replace(/^covers\//, '');

  return `${cleanBase}/${cleanPath}`;
}
