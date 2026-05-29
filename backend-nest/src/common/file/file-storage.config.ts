const DEFAULT_PORT = 4000;

export function getStorageDriver(): 'local' | 's3' {
  return process.env.FILE_STORAGE_DRIVER === 's3' ? 's3' : 'local';
}

export function getServerBaseUrl(): string {
  const configuredBase = process.env.SERVER_PUBLIC_URL?.trim();

  if (configuredBase) {
    if (!configuredBase.startsWith('http')) {
      throw new Error('SERVER_PUBLIC_URL must start with http/https');
    }

    return configuredBase.replace(/\/+$/, '');
  }

  const port = Number(process.env.PORT) || DEFAULT_PORT;
  return `http://localhost:${port}`;
}

export function getPublicFileBaseUrl(): string {
  if (getStorageDriver() === 's3') {
    const base = process.env.S3_PUBLIC_URL?.trim()?.replace(/\/+$/, '');

    if (!base) {
      throw new Error('S3_PUBLIC_URL is not defined');
    }

    return base;
  }

  return `${getServerBaseUrl()}/uploads`;
}

export function shouldServeLocalUploads(): boolean {
  return getStorageDriver() === 'local';
}
