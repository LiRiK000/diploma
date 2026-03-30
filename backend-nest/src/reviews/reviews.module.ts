import { Module } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { ReviewController } from './reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from 'src/gamification/gamification.module';

@Module({
  imports: [PrismaModule, GamificationModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewsModule {}
