export function getFullUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  const baseUrl = (process.env.S3_PUBLIC_URL || 'http://localhost:3000').trim();
  const cleanBase = baseUrl.replace(/\/+$/, '');

  let cleanPath = path.replace(/^\/+/, '');

  if (!cleanPath.startsWith('covers/')) {
    cleanPath = `covers/${cleanPath}`;
  }

  return `${cleanBase}/${cleanPath}`;
}
