import { Module } from '@nestjs/common';
import { AuthorsService } from './author.service';
import { AuthorsController } from './author.controller';
import { GamificationModule } from 'src/gamification/gamification.module';

@Module({
  imports: [GamificationModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorModule {}
