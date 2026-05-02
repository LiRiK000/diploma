import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileService } from '../common/file/file.service';

@Injectable()
export class BookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async getMainPageSections() {
    return this.prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        books: {
          take: 10,
          include: {
            author: { select: { firstName: true, lastName: true } },
            genre: { select: { label: true } },
          },
        },
      },
    });
  }

  async getSmartRecommendations(bookId: string) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
      select: {
        genreId: true,
        authorId: true,
        recommendedBooks: { select: { id: true } },
      },
    });

    if (!book) throw new NotFoundException();

    if (book.recommendedBooks.length > 0) {
      return this.getBookByIds(book.recommendedBooks.map((b) => b.id));
    }

    return this.prisma.book.findMany({
      where: {
        id: { not: bookId },
        OR: [{ genreId: book.genreId }, { authorId: book.authorId }],
      },
      take: 5,
      include: {
        author: { select: { firstName: true, lastName: true } },
      },
    });
  }

  private async getBookByIds(ids: string[]) {
    return this.prisma.book.findMany({
      where: { id: { in: ids } },
      include: {
        author: { select: { firstName: true, lastName: true } },
      },
    });
  }

  async getPaginatedBooks(take = 8, cursor?: string) {
    const books = await this.prisma.book.findMany({
      take: take + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { id: 'asc' },
      include: {
        genre: { select: { label: true } },
        author: { select: { firstName: true, lastName: true } },
      },
    });

    const hasNextPage = books.length > take;
    const items = hasNextPage ? books.slice(0, -1) : books;

    return {
      items: items.map((b) => ({
        ...b,
        author: `${b.author.firstName} ${b.author.lastName}`,
        genre: b.genre.label,
        coverUrl: b.coverImage,
      })),
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
          include: {
            author: { select: { firstName: true, lastName: true } },
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, surname: true } },
          },
        },
      },
    });

    if (!book) throw new NotFoundException('Книга не найдена');

    return {
      ...book,
      author: `${book.author.firstName} ${book.author.lastName}`,
      authorId: book.author.id,
      coverUrl: book.coverImage,
      createdAt: book.createdAt.toISOString(),
      updatedAt: book.updatedAt.toISOString(),
      publishedDate: book.publishedDate
        ? book.publishedDate.toISOString()
        : null,
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
        ...r,
        author: `${r.author.firstName} ${r.author.lastName}`,
        coverUrl: r.coverImage,
      })),
      reviews: book.reviews.map((r) => ({
        id: r.id,
        text: r.description,
        createdAt: r.createdAt.toISOString(),
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
    if (!existing) throw new NotFoundException('Книга не найдена');

    const { coverImage, coverUrl, publishedDate, subjects, ...cleanDto } =
      dto as UpdateBookDto & { coverUrl?: string; coverImage?: string };

    return this.prisma.book.update({
      where: { id },
      data: {
        ...cleanDto,
        publishedDate: publishedDate ? new Date(publishedDate) : undefined,
        subjects: Array.isArray(subjects) ? subjects : undefined,
      },
    });
  }

  async deleteBook(id: string) {
    const existing = await this.prisma.book.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Книга не найдена');
    await this.prisma.book.delete({ where: { id } });
  }

  async uploadBookCover(bookId: string, file: Express.Multer.File) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Книга не найдена');

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
      data: { favoriteBooks: { connect: { id: bookId } } },
    });
  }

  async removeFavorite(userId: string, bookId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { favoriteBooks: { disconnect: { id: bookId } } },
    });
  }

  async toggleFavorite(userId: string, bookId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { favoriteBooks: { select: { id: true } } },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    const isFavorite = user.favoriteBooks.some((book) => book.id === bookId);
    return isFavorite
      ? this.removeFavorite(userId, bookId)
      : this.addFavorite(userId, bookId);
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
      coverUrl: book.coverImage,
    }));
  }
}
