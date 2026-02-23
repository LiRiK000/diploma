/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import * as sharp from 'sharp';

@Injectable()
export class FileService {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(FileService.name);

  constructor() {
    // 1. Извлекаем переменные и гарантируем, что они строки (или пустые строки)
    const endpoint = process.env.S3_ENDPOINT ?? '';
    const port = process.env.S3_PORT ?? '';
    const accessKey = process.env.S3_ACCESS_KEY ?? '';
    const secretKey = process.env.S3_SECRET_KEY ?? '';

    // 2. Создаем клиент, явно указывая конфигурацию
    this.s3Client = new S3Client({
      endpoint: `http://${endpoint}:${port}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
    fileName: string,
  ): Promise<string> {
    try {
      // 3. Обработка через sharp. Чтобы линтер не ругался на цепочку вызовов,
      // можно типизировать результат вызова sharp(file.buffer)
      const imageProcessor: sharp.Sharp = sharp(file.buffer);

      const optimizedBuffer: Buffer = await imageProcessor
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const finalKey = `${folder}/${fileName}.webp`;
      const bucketName = process.env.S3_BUCKET ?? 'covers';

      // 4. Подготавливаем параметры для команды (явная типизация для линтера)
      const uploadParams: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: finalKey,
        Body: optimizedBuffer,
        ContentType: 'image/webp',
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await this.s3Client.send(new PutObjectCommand(uploadParams));

      return finalKey;
    } catch (error: unknown) {
      // 5. Безопасно обрабатываем ошибку для ESLint
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`S3 Upload Failed: ${message}`);

      throw new InternalServerErrorException(
        'Ошибка при загрузке файла в хранилище',
      );
    }
  }
}
