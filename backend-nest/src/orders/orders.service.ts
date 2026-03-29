import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus,
  Order,
  OrderItem,
  Book,
  User,
  AchievementCategory,
} from '@prisma/client';
import * as crypto from 'crypto';
import { GAMIFICATION_CONFIG } from 'src/gamification/gamification.constants';
import { GamificationService } from 'src/gamification/gamification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { getFullUrl } from 'src/utils/getFullCoverUrl';

type OrderWithRelations = Order & {
  user?: User;
  items: (OrderItem & {
    book: Book;
  })[];
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationService: GamificationService,
  ) {}

  private formatOrder(order: OrderWithRelations) {
    return {
      ...order,
      orderDate: order.orderDate.toISOString(),
      dueDate: order.dueDate.toISOString(),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      returnDate: order.returnDate ? order.returnDate.toISOString() : null,

      items: order.items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        book: {
          ...item.book,
          coverImage: item.book.coverImage,
          coverUrl: getFullUrl(item.book.coverImage),
          createdAt: item.book.createdAt.toISOString(),
          updatedAt: item.book.updatedAt.toISOString(),
        },
      })),
    };
  }

  async create(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: { include: { book: true } } },
      });

      if (!cart || cart.items.length === 0)
        throw new BadRequestException('Cart is empty');

      const order = await tx.order.create({
        data: {
          user: { connect: { id: userId } },
          status: OrderStatus.PENDING,
          dueDate: new Date(),
          items: {
            create: cart.items.map((item) => ({
              bookId: item.bookId,
              quantity: item.quantity,
            })),
          },
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return order;
    });
  }

  async findOne(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { book: true } },
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Заказ не найден');
    }

    return this.formatOrder(order as OrderWithRelations);
  }

  async findAll(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { book: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.formatOrder(order as OrderWithRelations));
  }

  async findAllForLibrarian() {
    const orders = await this.prisma.order.findMany({
      include: {
        user: true,
        items: { include: { book: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.formatOrder(order as OrderWithRelations));
  }

  async confirmReceipt(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== userId)
      throw new ForbiddenException('Доступ запрещен');
    if (order.status !== OrderStatus.READY_TO_PICKUP)
      throw new BadRequestException('Заказ еще не готов');

    return this.prisma.$transaction(async (tx) => {
      const orderItems = await tx.orderItem.findMany({
        where: { orderId },
        include: { book: true },
      });

      for (const item of orderItems) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { availableQuantity: { decrement: item.quantity } },
        });
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.ON_HAND,
          pickupCode: null,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        include: { items: { include: { book: true } } },
      });

      return this.formatOrder(updated as OrderWithRelations);
    });
  }

  async returnOrder(shortId: string) {
    if (shortId.length < 8) throw new BadRequestException('Минимум 8 символов');

    const order = await this.prisma.order.findFirst({
      where: {
        id: { startsWith: shortId.toLowerCase() },
        status: { in: [OrderStatus.ON_HAND, OrderStatus.OVERDUE] },
      },
      include: { items: { include: { book: true } } },
    });

    if (!order) throw new NotFoundException('Заказ не найден');

    return this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { availableQuantity: { increment: item.quantity } },
        });
      }
      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.RETURNED, returnDate: new Date() },
      });
      await tx.user.update({
        where: { id: order.userId },
        data: {
          readBooks: {
            connect: order.items.map((item) => ({ id: item.bookId })),
          },
        },
      });

      const booksCount = order.items.length;
      await this.gamificationService.handleUserActivity(order.userId, {
        expToAdd: booksCount * GAMIFICATION_CONFIG.EXP_PER_BOOK,
        category: AchievementCategory.READING,
        incrementValue: booksCount,
      });

      return { status: 'success' };
    });
  }

  async cancelOrderByUser(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order || order.userId !== userId)
      throw new ForbiddenException('Заказ не найден');
    if (order.status !== OrderStatus.PENDING)
      throw new BadRequestException('Нельзя отменить одобренный заказ');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async approveOrder(orderId: string) {
    const pickupCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.APPROVED, pickupCode },
    });
  }

  async rejectOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Заказ не найден');
    if (
      order.status === OrderStatus.RETURNED ||
      order.status === OrderStatus.ON_HAND
    ) {
      throw new BadRequestException('Нельзя отменить этот заказ');
    }
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async verifyPickupCode(code: string, librarianId: string) {
    const order = await this.prisma.order.findUnique({
      where: { pickupCode: code },
    });
    if (!order || order.status !== OrderStatus.APPROVED)
      throw new BadRequestException('Код невалиден');

    return this.prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.READY_TO_PICKUP, issuedById: librarianId },
    });
  }

  async getAdminStats() {
    const [totalOrders, pendingOrders, popularBooks] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.orderItem.groupBy({
        by: ['bookId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);
    return { totalOrders, pendingOrders, popularBooks };
  }
}
