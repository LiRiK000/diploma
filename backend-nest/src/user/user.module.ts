import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserBlockService } from './user-block.service';
import { UserController } from './user.controller';
import { UsersAdminController } from './users-admin.controller';
import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../common/file/file.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CheckBlockStatusGuard } from '../auth/guards/check-block-status.guard';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    FileModule,
    NotificationsModule,
  ],
  controllers: [UserController, UsersAdminController],
  providers: [UserService, UserBlockService, CheckBlockStatusGuard],
  exports: [UserService, UserBlockService, CheckBlockStatusGuard],
})
export class UserModule {}
