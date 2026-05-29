export function getStorageDriver(): 'local' | 's3' {
  return process.env.FILE_STORAGE_DRIVER === 's3' ? 's3' : 'local';
}

export function getServerBaseUrl(): string {
  const configuredBase = process.env.SERVER_PUBLIC_URL?.trim();
  if (configuredBase) {
    return configuredBase.replace(/\/+$/, '');
  }
  const port = Number(process.env.PORT) || 4000;
  return `http://localhost:${port}`;
}

export function getPublicFileBaseUrl(): string {
  if (getStorageDriver() === 's3') {
    const base = process.env.S3_PUBLIC_URL?.trim()?.replace(/\/+$/, '');
    const bucket = process.env.S3_BUCKET?.trim()?.replace(/\/+$/, '');

    if (!base) throw new Error('S3_PUBLIC_URL is not defined');
    if (!bucket) throw new Error('S3_BUCKET is not defined');

    // Возвращает http://localhost:9000/covers
    return `${base}/${bucket}`;
  }

  // Для локального драйвера возвращает http://localhost:4000/uploads
  return `${getServerBaseUrl()}/uploads`;
}
