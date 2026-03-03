import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ReviewService } from './reviews.service';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Оставить отзыв о книге' })
  async createReview(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    const data = await this.reviewService.create(userId, dto);
    return { status: 'success', data };
  }

  @Get('book/:bookId')
  @ApiOperation({ summary: 'Получить все отзывы о конкретной книге' })
  async getBookReviews(@Param('bookId') bookId: string) {
    const data = await this.reviewService.findByBook(bookId);
    return { status: 'success', data };
  }

  @Delete(':id')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удалить свой отзыв' })
  async removeReview(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return await this.reviewService.remove(userId, id);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Редактировать свой отзыв' })
  async updateReview(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    const data = await this.reviewService.update(userId, id, dto);
    return { status: 'success', data };
  }
}
