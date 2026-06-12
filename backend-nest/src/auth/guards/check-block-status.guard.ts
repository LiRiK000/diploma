import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';

import { UserBlockService } from '../../user/user-block.service';

interface RequestWithUser extends Request {
  user: { id: string; role: Role };
}

@Injectable()
export class CheckBlockStatusGuard implements CanActivate {
  constructor(private readonly userBlockService: UserBlockService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user?.id) {
      throw new ForbiddenException('Требуется авторизация');
    }

    if (user.role === Role.LIBRARIAN) {
      return true;
    }

    await this.userBlockService.ensureActiveUser(user.id);
    return true;
  }
}
