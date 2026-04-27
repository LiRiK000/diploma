const DEFAULT_PORT = 4001;

export function getStorageDriver(): 'local' | 's3' {
  return process.env.FILE_STORAGE_DRIVER === 's3' ? 's3' : 'local';
}

export function getServerBaseUrl(): string {
  const configuredBase = process.env.SERVER_PUBLIC_URL?.trim();
  if (configuredBase) {
    return configuredBase.replace(/\/+$/, '');
  }

  const port = Number(process.env.PORT) || DEFAULT_PORT;
  return `http://localhost:${port}`;
}

export function getPublicFileBaseUrl(): string {
  if (getStorageDriver() === 's3') {
    const s3PublicUrl = process.env.S3_PUBLIC_URL?.trim().replace(/\/+$/, '');
    const bucket = process.env.S3_BUCKET?.trim().replace(/^\/+|\/+$/g, '');

    if (s3PublicUrl && bucket) {
      return `${s3PublicUrl}/${bucket}`;
    }

    if (s3PublicUrl) {
      return s3PublicUrl;
    }
  }

  return `${getServerBaseUrl()}/uploads`;
}

export function shouldServeLocalUploads(): boolean {
  return getStorageDriver() === 'local';
}
