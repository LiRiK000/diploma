import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { FileModule } from 'src/common/file/file.module';

@Module({
  imports: [NotificationsModule, FileModule],
  controllers: [BookController],
  providers: [BookService, PrismaService],
})
export class BookModule {}
