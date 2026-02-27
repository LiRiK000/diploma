import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getFullUrl } from 'src/utils/getFullCoverUrl';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

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
          user: {
            connect: { id: userId },
          },
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

      return tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.ON_HAND,
          pickupCode: null,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });
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
      data: {
        status: OrderStatus.APPROVED,
        pickupCode,
      },
    });
  }

  async verifyPickupCode(code: string, librarianId: string) {
    const order = await this.prisma.order.findUnique({
      where: { pickupCode: code },
    });

    if (!order || order.status !== OrderStatus.APPROVED) {
      throw new BadRequestException('Неверный код или заказ не готов');
    }

    return this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.READY_TO_PICKUP,
        issuedById: librarianId,
      },
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

  async findOne(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { book: true },
        },
      },
    });

    if (!order) throw new NotFoundException('Заказ не найден');
    return order;
  }

  async findAll(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { book: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        book: {
          ...item.book,
          coverImage: getFullUrl(item.book.coverImage),
        },
      })),
    }));
  }

  async findAllForLibrarian() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: { book: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async returnOrder(orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: {
          startsWith: orderId,
        },
      },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(
        `Заказ с ID, начинающимся на ${orderId}, не найден`,
      );
    }

    if (
      order.status !== OrderStatus.ON_HAND &&
      order.status !== OrderStatus.OVERDUE
    ) {
      throw new BadRequestException(
        `Нельзя вернуть заказ в статусе ${order.status}.`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { availableQuantity: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.RETURNED,
          returnDate: new Date(),
        },
      });
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
      throw new BadRequestException(
        'Нельзя отменить уже выданный или завершенный заказ',
      );
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  }
}
