import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { userListSelect, UserListItem } from './select/user-list.select';

export type UserBlockStatus = {
  isInBlacklist: boolean;
  isSuspended: boolean;
  suspendedUntil: Date | null;
  banReason: string | null;
};

@Injectable()
export class UserBlockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  isCurrentlyBlocked(status: UserBlockStatus, now = new Date()): boolean {
    if (status.isInBlacklist) return true;
    if (!status.isSuspended) return false;
    if (!status.suspendedUntil) return true;
    return status.suspendedUntil > now;
  }

  async resolveBlockStatus(userId: string): Promise<UserBlockStatus> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        isInBlacklist: true,
        isSuspended: true,
        suspendedUntil: true,
        banReason: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const now = new Date();

    if (
      user.isSuspended &&
      user.suspendedUntil &&
      user.suspendedUntil <= now
    ) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          isSuspended: false,
          suspendedUntil: null,
          banReason: null,
        },
      });

      return {
        isInBlacklist: user.isInBlacklist,
        isSuspended: false,
        suspendedUntil: null,
        banReason: null,
      };
    }

    return user;
  }

  async ensureActiveUser(userId: string): Promise<void> {
    const status = await this.resolveBlockStatus(userId);

    if (!this.isCurrentlyBlocked(status)) return;

    if (status.isInBlacklist) {
      throw new ForbiddenException(
        status.banReason
          ? `Ваш аккаунт заблокирован. Причина: ${status.banReason}`
          : 'Ваш аккаунт заблокирован',
      );
    }

    const until = status.suspendedUntil?.toLocaleDateString('ru-RU') ?? '';
    throw new ForbiddenException(
      status.banReason
        ? `Ваш аккаунт заморожен до ${until}. Причина: ${status.banReason}`
        : `Ваш аккаунт заморожен до ${until}`,
    );
  }

  async findAllForLibrarian(): Promise<UserListItem[]> {
    return this.prisma.user.findMany({
      where: { role: Role.USER },
      select: userListSelect,
      orderBy: [{ surname: 'asc' }, { name: 'asc' }],
    });
  }

  async addToBlacklist(
    targetUserId: string,
    banReason: string,
  ): Promise<UserListItem> {
    await this.assertTargetUser(targetUserId);

    const user = await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        isInBlacklist: true,
        isSuspended: false,
        suspendedUntil: null,
        banReason,
      },
      select: userListSelect,
    });

    await this.notifications.notifyAccountBlacklisted(targetUserId, banReason);

    return user;
  }

  async suspendUser(
    targetUserId: string,
    suspendedUntil: Date,
    banReason: string,
  ): Promise<UserListItem> {
    await this.assertTargetUser(targetUserId);

    const now = new Date();
    if (suspendedUntil <= now) {
      throw new BadRequestException(
        'Дата окончания заморозки должна быть в будущем',
      );
    }

    const user = await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        isInBlacklist: false,
        isSuspended: true,
        suspendedUntil,
        banReason,
      },
      select: userListSelect,
    });

    await this.notifications.notifyAccountSuspended(
      targetUserId,
      suspendedUntil,
      banReason,
    );

    return user;
  }

  async unblockUser(targetUserId: string): Promise<UserListItem> {
    await this.assertTargetUser(targetUserId);

    const user = await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        isInBlacklist: false,
        isSuspended: false,
        suspendedUntil: null,
        banReason: null,
      },
      select: userListSelect,
    });

    const overdueBookTitles = await this.getOverdueBookTitles(targetUserId);
    await this.notifications.notifyAccountUnblocked(
      targetUserId,
      overdueBookTitles,
    );

    return user;
  }

  private async assertTargetUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (user.role !== Role.USER) {
      throw new BadRequestException(
        'Нельзя блокировать аккаунты библиотекарей',
      );
    }
  }

  private async getOverdueBookTitles(userId: string): Promise<string[]> {
    const overdueOrders = await this.prisma.order.findMany({
      where: { userId, status: OrderStatus.OVERDUE },
      select: {
        items: {
          select: {
            book: { select: { title: true } },
          },
        },
      },
    });

    const titles = overdueOrders.flatMap((order) =>
      order.items.map((item) => item.book.title),
    );

    return [...new Set(titles)];
  }
}
