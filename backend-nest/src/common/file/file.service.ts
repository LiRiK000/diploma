import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  // Определяем путь к папке uploads в корне проекта
  private readonly uploadRoot = join(process.cwd(), 'uploads');

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
    fileName: string,
  ): Promise<string> {
    try {
      const optimizedBuffer: Buffer = await sharp(file.buffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const targetDir = join(this.uploadRoot, folder);
      const finalKey = `${folder}/${fileName}.webp`;
      const fullPath = join(this.uploadRoot, finalKey);

      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      writeFileSync(fullPath, optimizedBuffer);

      this.logger.log(`File saved locally: ${fullPath}`);

      return finalKey;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Local Upload Failed:
         ${message}`);
      ы;

      throw new InternalServerErrorException(
        'Ошибка при сохранении файла на диск',
      );
    }
  }
}
