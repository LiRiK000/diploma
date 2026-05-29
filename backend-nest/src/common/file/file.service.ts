import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly uploadRoot = join(process.cwd(), 'uploads');
  private readonly s3Client: S3Client | null = null;

  constructor(private readonly configService: ConfigService) {
    // Инициализируем S3 клиент только если выбран драйвер s3
    if (this.configService.get<string>('FILE_STORAGE_DRIVER') === 's3') {
      this.s3Client = new S3Client({
        endpoint: this.configService.get<string>('S3_ENDPOINT'),
        region: 'us-east-1', // Для MinIO можно указать дефолтный регион
        credentials: {
          accessKeyId: this.configService.get<string>('S3_ACCESS_KEY') || '',
          secretAccessKey:
            this.configService.get<string>('S3_SECRET_KEY') || '',
        },
        forcePathStyle: true, // Критично для MinIO, чтобы пути были /bucket/key
      });
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
    fileName: string,
  ): Promise<string> {
    try {
      // 1. Оптимизируем изображение через Sharp (остается общим для обоих драйверов)
      const optimizedBuffer: Buffer = await sharp(file.buffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const finalKey = `${folder}/${fileName}.webp`;
      const driver = this.configService.get<string>('FILE_STORAGE_DRIVER');

      // 2. Ветвление логики в зависимости от драйвера
      if (driver === 's3' && this.s3Client) {
        const bucket = this.configService.get<string>('S3_BUCKET') || 'covers';

        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: finalKey,
            Body: optimizedBuffer,
            ContentType: 'image/webp',
          }),
        );

        this.logger.log(`File saved to MinIO S3: ${bucket}/${finalKey}`);
      } else {
        // Локальное сохранение (fallback)
        const targetDir = join(this.uploadRoot, folder);
        const fullPath = join(this.uploadRoot, finalKey);

        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }

        writeFileSync(fullPath, optimizedBuffer);
        this.logger.log(`File saved locally: ${fullPath}`);
      }

      return finalKey;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Upload Failed: ${message}`);
      throw new InternalServerErrorException(
        'Ошибка при сохранении файла в хранилище',
      );
    }
  }
}
