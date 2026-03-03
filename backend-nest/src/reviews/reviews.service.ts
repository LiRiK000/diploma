import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const { bookId, description } = dto;

    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Книга не найдена');

    const existingReview = await this.prisma.review.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    if (existingReview) {
      throw new ConflictException('Вы уже оставили отзыв на эту книгу');
    }

    return this.prisma.review.create({
      data: {
        userId,
        bookId,
        description,
      },
    });
  }

  async findByBook(bookId: string) {
    return this.prisma.review.findMany({
      where: { bookId },
      include: {
        user: {
          select: { name: true, surname: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) throw new NotFoundException('Отзыв не найден');

    if (review.userId !== userId) {
      throw new ForbiddenException('Вы не можете удалить чужой отзыв');
    }

    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'Отзыв удален' };
  }

  async update(userId: string, id: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) throw new NotFoundException('Отзыв не найден');
    if (review.userId !== userId)
      throw new ForbiddenException('Нельзя редактировать чужой отзыв');

    return this.prisma.review.update({
      where: { id },
      data: { description: dto.description },
    });
  }
}
