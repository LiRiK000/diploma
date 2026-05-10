import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetCatalogDto } from './dto/get-catalog.dto';
import type { Prisma } from '@prisma/client';
import { getFullUrl } from '../utils/getFullCoverUrl';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getCatalog(dto: GetCatalogDto) {
    const {
      page = 1,
      limit = 12,
      genreId,
      authorId,
      search,
      sort = 'newest',
      collection,
    } = dto;

    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = {
      ...(genreId && { genreId }),
      ...(authorId && { authorId }),
      ...(collection && {
        collections: {
          some: {
            slug: collection,
            isActive: true,
          },
        },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { author: { firstName: { contains: search, mode: 'insensitive' } } },
          { author: { lastName: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const orderBy: Prisma.BookOrderByWithRelationInput =
      sort === 'newest'
        ? { createdAt: 'desc' }
        : sort === 'oldest'
          ? { createdAt: 'asc' }
          : { title: 'asc' };

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true },
          },
          genre: {
            select: { id: true, label: true },
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    let collectionInfo = null;
    if (collection) {
      collectionInfo = await this.prisma.collection.findUnique({
        where: { slug: collection },
        select: { title: true, description: true },
      });
    }

    return {
      items: books.map((book) => ({
        id: book.id,
        title: book.title,
        author: `${book.author.firstName} ${book.author.lastName}`,
        authorId: book.author.id,
        genre: book.genre.label,
        genreId: book.genre.id,
        coverUrl: getFullUrl(book.coverImage),
        availableQuantity: book.availableQuantity,
        description: book.description,
        ratingsCount: book._count.reviews,
      })),
      collection: collectionInfo,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
