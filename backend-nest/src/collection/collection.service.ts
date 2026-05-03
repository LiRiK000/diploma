import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCollectionDto) {
    const { bookIds, ...data } = dto;
    return this.prisma.collection.create({
      data: {
        ...data,
        books: {
          // Если переданы ID книг, создаем связи
          connect: bookIds?.map((id) => ({ id })) || [],
        },
      },
      include: { books: true },
    });
  }

  async findAll() {
    return this.prisma.collection.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { books: true }, // Чтобы в таблице админки видеть кол-во книг
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
            author: true, // Подтягиваем авторов для списка в модалке
          },
        },
      },
    });

    if (!collection) throw new NotFoundException('Коллекция не найдена');
    return collection;
  }

  async update(id: string, dto: UpdateCollectionDto) {
    const { bookIds, ...data } = dto;

    return this.prisma.collection.update({
      where: { id },
      data: {
        ...data,
        // Используем set только если bookIds вообще пришли в запросе
        ...(bookIds && {
          books: {
            set: bookIds.map((bookId) => ({ id: bookId })),
          },
        }),
      },
      include: { books: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Проверка на существование
    return this.prisma.collection.delete({ where: { id } });
  }
}
