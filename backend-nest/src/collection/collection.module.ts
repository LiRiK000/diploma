import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Импорт твоей призмы

@Module({
  imports: [PrismaModule],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [CollectionService], // Если понадобится в других модулях
})
export class CollectionModule {}
