import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { GamificationModule } from 'src/gamification/gamification.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [GamificationModule, NotificationsModule, UserModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
