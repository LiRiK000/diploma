import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <-- ПРОВЕРЬ ЭТОТ ИМПОРТ
import { FileService } from './file.service';

@Module({
  imports: [ConfigModule], // <-- ОБЯЗАТЕЛЬНО ДОБАВЬ СЮДА
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
