import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  Notification,
  NotificationPriority,
  NotificationType,
  OrderStatus,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { QueryNotificationsDto } from './dto/query-notifications.dto';

export type NotificationDb = PrismaService | Prisma.TransactionClient;

export type CreateNotificationInput = {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  payload?: Prisma.InputJsonValue;
  link?: string;
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  orderDeepLink(orderId: string): string {
    return `/orders/${orderId}`;
  }

  bookDeepLink(bookId: string): string {
    return `/books/${bookId}`;
  }

  async createForUser(
    db: NotificationDb,
    input: CreateNotificationInput,
  ): Promise<Notification> {
    return db.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: input.type ?? NotificationType.SYSTEM,
        priority: input.priority ?? NotificationPriority.MEDIUM,
        ...(input.payload !== undefined ? { payload: input.payload } : {}),
        link: input.link,
      },
    });
  }

  /** Создание вне транзакции; ошибки логируются и не пробрасываются. */
  async emitSafe(input: CreateNotificationInput): Promise<void> {
    try {
      await this.createForUser(this.prisma, input);
    } catch (err) {
      this.logger.warn(
        `Не удалось сохранить уведомление для userId=${input.userId}: ${String(err)}`,
      );
    }
  }

  async notifyOrderStatus(params: {
    userId: string;
    orderId: string;
    status: OrderStatus;
    pickupCode?: string | null;
    cancelledBy?: 'user' | 'librarian';
  }): Promise<void> {
    const link = this.orderDeepLink(params.orderId);
    const basePayload = {
      orderId: params.orderId,
      status: params.status,
    };

    switch (params.status) {
      case OrderStatus.PENDING:
        await this.emitSafe({
          userId: params.userId,
          type: NotificationType.ORDER_STATUS,
          priority: NotificationPriority.MEDIUM,
          title: 'Заказ создан',
          message:
            'Заявка на выдачу книг отправлена. Ожидайте подтверждения библиотекаря.',
          payload: basePayload,
          link,
        });
        break;
      case OrderStatus.APPROVED:
        await this.emitSafe({
          userId: params.userId,
          type: NotificationType.ORDER_STATUS,
          priority: NotificationPriority.HIGH,
          title: 'Заказ одобрен',
          message: params.pickupCode
            ? `Заберите книги по коду выдачи: ${params.pickupCode}. Покажите его библиотекарю.`
            : 'Заказ одобрен. Скоро вы сможете забрать книги.',
          payload: { ...basePayload, pickupCode: params.pickupCode },
          link,
        });
        break;
      case OrderStatus.READY_TO_PICKUP:
        await this.emitSafe({
          userId: params.userId,
          type: NotificationType.ORDER_STATUS,
          priority: NotificationPriority.HIGH,
          title: 'Заказ готов к выдаче',
          message:
            'Книги ждут вас в библиотеке. Подтвердите получение в приложении после выдачи.',
          payload: basePayload,
          link,
        });
        break;
      case OrderStatus.ON_HAND:
        await this.emitSafe({
          userId: params.userId,
          type: NotificationType.ORDER_STATUS,
          priority: NotificationPriority.MEDIUM,
          title: 'Книги у вас',
          message:
            'Вы подтвердили получение. Не забудьте вернуть книги до указанного срока.',
          payload: basePayload,
          link,
        });
        break;
      case OrderStatus.RETURNED:
        await this.emitSafe({
          userId: params.userId,
          type: NotificationType.ORDER_STATUS,
          priority: NotificationPriority.LOW,
          title: 'Книги возвращены',
          message: 'Спасибо! Заказ закрыт, книги снова в фонде библиотеки.',
          payload: basePayload,
          link,
        });
        break;
      case OrderStatus.CANCELLED:
        await this.emitSafe({
          userId: params.userId,
          type: NotificationType.ORDER_STATUS,
          priority: NotificationPriority.MEDIUM,
          title:
            params.cancelledBy === 'librarian'
              ? 'Заказ отклонён'
              : 'Заказ отменён',
          message:
            params.cancelledBy === 'librarian'
              ? 'Библиотекарь отклонил заявку. Вы можете оформить новый заказ.'
              : 'Вы отменили заявку до выдачи.',
          payload: { ...basePayload, cancelledBy: params.cancelledBy },
          link,
        });
        break;
      case OrderStatus.OVERDUE:
        await this.emitSafe({
          userId: params.userId,
          type: NotificationType.OVERDUE,
          priority: NotificationPriority.CRITICAL,
          title: 'Просрочен возврат',
          message:
            'Срок возврата книг истёк. Пожалуйста, верните издания в библиотеку.',
          payload: basePayload,
          link,
        });
        break;
      default:
        await this.emitSafe({
          userId: params.userId,
          type: NotificationType.ORDER_STATUS,
          priority: NotificationPriority.MEDIUM,
          title: 'Статус заказа обновлён',
          message: `Текущий статус: ${params.status}`,
          payload: basePayload,
          link,
        });
    }
  }

  async notifyFollowersNewBook(params: {
    authorId: string;
    bookId: string;
    bookTitle: string;
    authorName: string;
  }): Promise<void> {
    try {
      const followers = await this.prisma.user.findMany({
        where: { followedAuthors: { some: { id: params.authorId } } },
        select: { id: true },
      });
      if (followers.length === 0) return;

      const link = this.bookDeepLink(params.bookId);
      await this.prisma.notification.createMany({
        data: followers.map((u) => ({
          userId: u.id,
          type: NotificationType.NEW_ARRIVAL,
          priority: NotificationPriority.LOW,
          title: 'Новинка от избранного автора',
          message: `${params.authorName}: «${params.bookTitle}» уже в каталоге.`,
          payload: {
            bookId: params.bookId,
            authorId: params.authorId,
          } as Prisma.InputJsonValue,
          link,
        })),
      });
    } catch (err) {
      this.logger.warn(
        `Не удалось разослать уведомления о новой книге bookId=${params.bookId}: ${String(err)}`,
      );
    }
  }

  async notifyWelcome(userId: string, displayName: string): Promise<void> {
    await this.emitSafe({
      userId,
      type: NotificationType.SYSTEM,
      priority: NotificationPriority.LOW,
      title: 'Добро пожаловать',
      message: `Здравствуйте, ${displayName}! Удачного чтения и удобных заказов в библиотеке.`,
      payload: { kind: 'welcome' },
    });
  }

  async notifyReviewPublished(
    userId: string,
    bookTitle: string,
    bookId: string,
  ): Promise<void> {
    await this.emitSafe({
      userId,
      type: NotificationType.SYSTEM,
      priority: NotificationPriority.LOW,
      title: 'Отзыв опубликован',
      message: `Спасибо за отзыв на книгу «${bookTitle}».`,
      payload: { bookId, kind: 'review_published' },
      link: this.bookDeepLink(bookId),
    });
  }

  async findPageForUser(userId: string, query: QueryNotificationsDto) {
    const take = query.take ?? 20;

    const rows = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: take + 1,

      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });

    const hasNext = rows.length > take;
    const items = hasNext ? rows.slice(0, take) : rows;
    const nextCursor = hasNext ? items[items.length - 1]?.id : null;

    return {
      items,
      nextCursor,

      total: await this.prisma.notification.count({ where: { userId } }),
    };
  }

  async countUnread(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isViewed: false },
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const existing = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException('Уведомление не найдено');
    }
    return this.prisma.notification.update({
      where: { id },
      data: { isViewed: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isViewed: false },
      data: { isViewed: true },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const existing = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException('Уведомление не найдено');
    }
    await this.prisma.notification.delete({ where: { id } });
  }
}
