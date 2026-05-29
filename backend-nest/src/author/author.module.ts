import { Module } from '@nestjs/common';
import { AuthorsService } from './author.service';
import { AuthorsController } from './author.controller';
import { GamificationModule } from 'src/gamification/gamification.module';
import { FileModule } from 'src/common/file/file.module';

@Module({
  imports: [GamificationModule, FileModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorModule {}
