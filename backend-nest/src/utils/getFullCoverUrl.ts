export function getFullUrl(path: string | null): string {
  if (!path) return '';

  if (path.startsWith('http')) {
    return path;
  }

  const baseUrl = process.env.S3_PUBLIC_URL || '';

  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');

  return `${cleanBase}/${cleanPath}`;
}
