import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileService } from 'src/common/file/file.service';

@Injectable()
export class BookService {
  private readonly s3PublicUrl = process.env.S3_PUBLIC_URL;

  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  private getFullCoverUrl(path: string | null): string {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${this.s3PublicUrl}/${path}`;
  }

  async getPaginatedBooks(take = 8, cursor?: string) {
    const books = await this.prisma.book.findMany({
      take: take + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { id: 'asc' },
      select: {
        id: true,
        authorId: true,
        genreId: true,
        title: true,
        availableQuantity: true,
        coverImage: true,
        description: true,
        genre: {
          select: { label: true },
        },
        author: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    const hasNextPage = books.length > take;
    const items = hasNextPage ? books.slice(0, -1) : books;

    const formatted = items.map((b) => ({
      id: b.id,
      authorId: b.authorId,
      genreId: b.genreId,
      title: b.title,
      author: `${b.author.firstName} ${b.author.lastName}`,
      coverUrl: this.getFullCoverUrl(b.coverImage),
      availableQuantity: b.availableQuantity,
      genre: b.genre.label,
      description: b.description,
    }));

    return {
      items: formatted,
      nextCursor: hasNextPage ? items[items.length - 1].id : null,
    };
  }

  async getBookById(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        genre: { select: { id: true, label: true, value: true } },
        recommendedBooks: {
          select: {
            id: true,
            title: true,
            authorId: true,
            coverImage: true,
            author: { select: { firstName: true, lastName: true } },
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },

          select: {
            id: true,
            description: true,
            createdAt: true,
            userId: true,
            user: { select: { id: true, name: true, surname: true } },
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException('Книга не найдена');
    }

    return {
      id: book.id,
      authorId: book.author.id,
      title: book.title,
      author: `${book.author.firstName} ${book.author.lastName}`,
      coverUrl: this.getFullCoverUrl(book.coverImage),
      availableQuantity: book.availableQuantity,
      description: book.description,
      subjects: book.subjects,
      publishYear: book.publishedDate
        ? new Date(book.publishedDate).getFullYear()
        : null,
      ratingsCount: book.reviews.length,
      details: {
        pages: book.pageCount,
        language: book.language,
        publisher: book.publisher,
        genre: book.genre.label,
      },
      tags: book.subjects || [],
      recommendedBooks: book.recommendedBooks.map((r) => ({
        id: r.id,
        title: r.title,
        author: `${r.author.firstName} ${r.author.lastName}`,
        coverUrl: this.getFullCoverUrl(r.coverImage),
      })),
      reviews: book.reviews.map((r) => ({
        id: r.id,
        text: r.description,
        createdAt: r.createdAt,
        userName: `${r.user.name} ${r.user.surname}`,
        userId: r.user.id,
      })),
    };
  }

  async createBook(dto: CreateBookDto) {
    if (!dto.title || !dto.authorId || !dto.genreId) {
      throw new BadRequestException(
        'Необходимо указать title, authorId и genreId',
      );
    }

    return this.prisma.book.create({
      data: {
        ...dto,
        publishedDate: dto.publishedDate ? new Date(dto.publishedDate) : null,
        subjects: Array.isArray(dto.subjects) ? dto.subjects : [],
      },
    });
  }

  async updateBook(id: string, dto: UpdateBookDto) {
    const existing = await this.prisma.book.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Книга не найдена');
    }

    return this.prisma.book.update({
      where: { id },
      data: {
        ...dto,
        publishedDate: dto.publishedDate
          ? new Date(dto.publishedDate)
          : existing.publishedDate,
        subjects: Array.isArray(dto.subjects)
          ? dto.subjects
          : existing.subjects,
      },
    });
  }

  async deleteBook(id: string) {
    const existing = await this.prisma.book.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Книга не найдена');
    }

    await this.prisma.book.delete({ where: { id } });
  }
  async uploadBookCover(bookId: string, file: Express.Multer.File) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Книга не найдена');
    }

    const path = await this.fileService.uploadImage(file, 'books', bookId);

    return this.prisma.book.update({
      where: { id: bookId },
      data: { coverImage: path },
    });
  }
  async addFavorite(userId: string, bookId: string) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Книга не найдена');

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteBooks: {
          connect: { id: bookId },
        },
      },
    });
  }

  async removeFavorite(userId: string, bookId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteBooks: {
          disconnect: { id: bookId },
        },
      },
    });
  }
  async toggleFavorite(userId: string, bookId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { favoriteBooks: { select: { id: true } } },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    const isFavorite = user.favoriteBooks.some((book) => book.id === bookId);

    if (isFavorite) {
      return this.removeFavorite(userId, bookId);
    } else {
      return this.addFavorite(userId, bookId);
    }
  }

  async getFavorites(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        favoriteBooks: {
          include: {
            author: true,
            genre: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user.favoriteBooks.map((book) => ({
      ...book,
      author: `${book.author.firstName} ${book.author.lastName}`,
      genre: book.genre.label,
      coverUrl: this.getFullCoverUrl(book.coverImage),
    }));
  }
}
