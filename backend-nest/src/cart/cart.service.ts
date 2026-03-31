import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { getFullUrl } from 'src/utils/getFullCoverUrl';

@Injectable()
export class CartService {
  private readonly MAX_CART_ITEMS = 3;

  constructor(private prisma: PrismaService) {}
  private readonly s3PublicUrl = process.env.S3_PUBLIC_URL;

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                coverImage: true,
                availableQuantity: true,
                author: { select: { firstName: true, lastName: true } },
                genre: { select: { label: true } },
              },
            },
          },
        },
      },
    });

    const items = (cart?.items || []).map((item) => ({
      id: item.id,
      bookId: item.book.id,
      title: item.book.title,
      author: `${item.book.author.firstName} ${item.book.author.lastName}`,
      coverUrl: getFullUrl(item.book.coverImage),
      genre: item.book.genre.label,
      quantity: item.quantity,
      available: item.book.availableQuantity,
    }));

    return {
      items,
      totalItems: items.length,
      canAddMore: items.length < this.MAX_CART_ITEMS,
    };
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const { bookId, quantity } = dto;

    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true, availableQuantity: true },
    });

    if (!book) throw new NotFoundException('Книга не найдена');
    if (book.availableQuantity < quantity) {
      throw new BadRequestException(
        `Доступно только ${book.availableQuantity} экз.`,
      );
    }

    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    const currentItemsCount = await this.prisma.cartItem.count({
      where: { cartId: cart.id },
    });

    const existingItem = await this.prisma.cartItem.findUnique({
      where: { cartId_bookId: { cartId: cart.id, bookId } },
    });

    if (!existingItem && currentItemsCount >= this.MAX_CART_ITEMS) {
      throw new BadRequestException(
        `Максимум ${this.MAX_CART_ITEMS} книги в корзине`,
      );
    }

    return this.prisma.cartItem.upsert({
      where: { cartId_bookId: { cartId: cart.id, bookId } },
      update: { quantity: { increment: quantity } },
      create: { cartId: cart.id, bookId, quantity },
    });
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, book: { select: { availableQuantity: true } } },
    });

    if (!item || item.cart.userId !== userId)
      throw new NotFoundException('Элемент не найден');

    if (quantity > item.book.availableQuantity) {
      throw new BadRequestException(
        `Доступно только ${item.book.availableQuantity}`,
      );
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== userId)
      throw new NotFoundException('Элемент не найден');

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return { message: 'Удалено' };
  }

  async getTotal(userId: string) {
    const count = await this.prisma.cartItem.count({
      where: { cart: { userId } },
    });
    return { totalItems: count };
  }
}
