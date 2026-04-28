import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetCatalogDto } from './dto/get-catalog.dto';
import type { Prisma } from '@prisma/client';
import { getFullUrl } from '../utils/getFullCoverUrl';

@Injectable()
export class CatalogService {
  private readonly s3PublicUrl = process.env.S3_PUBLIC_URL;

  constructor(private readonly prisma: PrismaService) {}

  async getCatalog(dto: GetCatalogDto) {
    const {
      page = 1,
      limit = 12,
      genreId,
      authorId,
      search,
      sort = 'newest',
    } = dto;

    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = {
      ...(genreId && { genreId }),
      ...(authorId && { authorId }),

      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            author: {
              firstName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            author: {
              lastName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
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
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          genre: {
            select: {
              id: true,
              label: true,
            },
          },
        },
      }),

      this.prisma.book.count({ where }),
    ]);

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
      })),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
