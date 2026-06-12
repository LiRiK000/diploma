import { Module } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { ReviewController } from './reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from 'src/gamification/gamification.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, GamificationModule, NotificationsModule, UserModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewsModule {}
