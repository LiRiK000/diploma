import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCollectionDto) {
    const { bookIds, ...data } = dto;
    try {
      return await this.prisma.collection.create({
        data: {
          ...data,
          books: {
            connect: bookIds?.map((id) => ({ id })) || [],
          },
        },
        include: { books: true },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Коллекция с таким Slug уже существует');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.collection.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { books: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        books: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!collection) throw new NotFoundException('Коллекция не найдена');
    return collection;
  }

  async update(id: string, dto: UpdateCollectionDto) {
    const { bookIds, ...data } = dto;
    try {
      return await this.prisma.collection.update({
        where: { id },
        data: {
          ...data,
          books: {
            set: bookIds?.map((id) => ({ id })) || [],
          },
        },
        include: { books: true },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Этот Slug уже занят другой коллекцией');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.collection.delete({ where: { id } });
  }

  async getPersonalized(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        favoriteBooks: {
          select: { genreId: true },
        },
      },
    });

    if (!user || user.favoriteBooks.length === 0) {
      const popularBooks = await this.prisma.book.findMany({
        take: 10,
        include: { author: true },
      });
      return { title: 'Рекомендации', books: popularBooks };
    }

    const genreIds = Array.from(
      new Set(user.favoriteBooks.map((b) => b.genreId)),
    );

    const recommendations = await this.prisma.book.findMany({
      where: { genreId: { in: genreIds } },
      take: 20,
      include: { author: true },
    });

    return {
      title: 'На основе вашего избранного',
      description: 'Вам могут понравиться эти книги',
      books: recommendations,
    };
  }
}
