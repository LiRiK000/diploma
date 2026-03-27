import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { GamificationModule } from 'src/gamification/gamification.module';

@Module({
  imports: [GamificationModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
