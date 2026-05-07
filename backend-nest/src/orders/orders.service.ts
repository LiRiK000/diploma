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
  Author,
  Genre,
} from '@prisma/client';

import * as crypto from 'crypto';

import { PrismaService } from 'src/prisma/prisma.service';
import { GamificationService } from 'src/gamification/gamification.service';
import { AchievementCategory } from '@prisma/client';
import { GAMIFICATION_CONFIG } from 'src/gamification/gamification.constants';

import { OrderMapper } from './mappers/order.mapper';
import { calculateDueDate } from './utils/due-date.util';

type OrderWithRelations = Order & {
  user: User;
  items: (OrderItem & {
    book: Book & {
      author: Author;
      genre: Genre;
    };
  })[];
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationService: GamificationService,
  ) {}

  async create(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Корзина пуста');
      }

      const order = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          dueDate: calculateDueDate(30),
          items: {
            create: cart.items.map((item) => ({
              bookId: item.bookId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          user: true,
          items: {
            include: { book: { include: { author: true, genre: true } } },
          },
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      await this.gamificationService.handleUserActivity(userId, {
        expToAdd: 50,
        category: AchievementCategory.SYSTEM,
        incrementValue: 1,
      });

      return OrderMapper.toResponse(order as OrderWithRelations);
    });
  }

  async returnOrderByCode(shortCode: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: {
          startsWith: shortCode.toLowerCase(),
        },
        status: OrderStatus.ON_HAND,
      },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(
        'Заказ с таким коротким кодом не найден или он не "на руках"',
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
          pickupCode: null,
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
      throw new BadRequestException('Нельзя отменить этот заказ');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async approveOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order || order.status !== OrderStatus.PENDING)
      throw new BadRequestException('Заказ уже обработан или не существует');

    const pickupCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.APPROVED, pickupCode },
    });
  }

  async verifyPickupCode(code: string, librarianId: string) {
    const order = await this.prisma.order.findUnique({
      where: { pickupCode: code.toUpperCase() },
    });
    if (!order || order.status !== OrderStatus.APPROVED)
      throw new BadRequestException('Невалидный код для выдачи');

    return this.prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.READY_TO_PICKUP, issuedById: librarianId },
    });
  }
  async rejectOrder(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async confirmReceipt(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.userId !== userId)
      throw new ForbiddenException('Доступ запрещен');
    if (order.status !== OrderStatus.READY_TO_PICKUP)
      throw new BadRequestException('Заказ не готов');

    return this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { availableQuantity: { decrement: item.quantity } },
        });
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.ON_HAND,
        },
        include: {
          user: true,
          items: {
            include: { book: { include: { author: true, genre: true } } },
          },
        },
      });

      return OrderMapper.toResponse(updated as OrderWithRelations);
    });
  }

  async returnOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) throw new NotFoundException('Заказ не найден');
    if (order.status !== OrderStatus.ON_HAND)
      throw new BadRequestException('Этот заказ еще не выдан');

    return this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { availableQuantity: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: OrderStatus.RETURNED, returnDate: new Date() },
      });
    });
  }

  async findOne(orderId: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: { book: { include: { author: true, genre: true } } },
        },
      },
    });
    if (!order) throw new NotFoundException('Заказ не найден');
    if (userId && order.userId !== userId)
      throw new ForbiddenException('Доступ запрещён');
    return OrderMapper.toResponse(order as OrderWithRelations);
  }

  async findAll(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        user: true,
        items: {
          include: { book: { include: { author: true, genre: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => OrderMapper.toResponse(o as OrderWithRelations));
  }

  async findAllOrdersForLibrarian() {
    const orders = await this.prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: { book: { include: { author: true, genre: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => OrderMapper.toResponse(o as OrderWithRelations));
  }
}
