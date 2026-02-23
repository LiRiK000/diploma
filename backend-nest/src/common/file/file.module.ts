import { Module, Global } from '@nestjs/common';
import { FileService } from './file.service';

@Global() // Это сделает сервис доступным во всех модулях без лишних импортов
@Module({
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
