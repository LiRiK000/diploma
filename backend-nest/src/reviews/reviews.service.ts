import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GamificationService } from 'src/gamification/gamification.service';
import { AchievementCategory, Prisma, Review } from '@prisma/client';

export interface ReviewResponse extends Omit<
  Review,
  'createdAt' | 'updatedAt'
> {
  createdAt: string;
  updatedAt: string;
  userName?: string;
  userAvatar?: string | null;
}

type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        surname: true;
        avatarUrl: true;
      };
    };
  };
}>;

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationService: GamificationService,
  ) {}

  private mapReview(review: ReviewWithUser): ReviewResponse {
    const { user, ...reviewData } = review;
    return {
      ...reviewData,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
      userName: user ? `${user.name} ${user.surname}` : undefined,
      userAvatar: user?.avatarUrl || null,
    };
  }

  async create(userId: string, dto: CreateReviewDto): Promise<ReviewResponse> {
    const { bookId, description } = dto;

    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Книга не найдена');

    const existingReview = await this.prisma.review.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    if (existingReview) {
      throw new ConflictException('Вы уже оставили отзыв на эту книгу');
    }

    const review = await this.prisma.review.create({
      data: { userId, bookId, description },
      include: {
        user: { select: { name: true, surname: true, avatarUrl: true } },
      },
    });

    try {
      await this.gamificationService.handleUserActivity(userId, {
        expToAdd: 160,
        category: AchievementCategory.SOCIAL,
        incrementValue: 1,
      });
    } catch (error) {
      console.error('Gamification error:', error);
    }

    return this.mapReview(review);
  }

  async findByBook(bookId: string): Promise<ReviewResponse[]> {
    const reviews = await this.prisma.review.findMany({
      where: { bookId },
      include: {
        user: { select: { name: true, surname: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((r) => this.mapReview(r));
  }

  async remove(userId: string, reviewId: string): Promise<{ message: string }> {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) throw new NotFoundException('Отзыв не найден');
    if (review.userId !== userId)
      throw new ForbiddenException('Доступ запрещен');

    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'Отзыв удален' };
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewResponse> {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) throw new NotFoundException('Отзыв не найден');
    if (review.userId !== userId)
      throw new ForbiddenException('Доступ запрещен');

    const updated = await this.prisma.review.update({
      where: { id },
      data: { description: dto.description },
      include: {
        user: { select: { name: true, surname: true, avatarUrl: true } },
      },
    });

    return this.mapReview(updated);
  }
}
