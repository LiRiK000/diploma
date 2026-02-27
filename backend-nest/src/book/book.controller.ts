import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить список избранных книг пользователя' })
  async getFavorites(@CurrentUser('id') userId: string) {
    const data = await this.bookService.getFavorites(userId);
    return { status: 'success', data };
  }

  @Get()
  @ApiOperation({ summary: 'Получить список книг с пагинацией' })
  async getBooks(
    @Query('take') take?: string,
    @Query('cursor') cursor?: string,
  ) {
    const data = await this.bookService.getPaginatedBooks(
      Number(take) || 8,
      cursor,
    );
    return { status: 'success', data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить детальную информацию о книге' })
  async getBook(@Param('id') id: string) {
    const data = await this.bookService.getBookById(id);
    return { status: 'success', data };
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Добавить/удалить книгу из избранного (toggle)' })
  async toggleFavorite(
    @Param('id') bookId: string,
    @CurrentUser('id') userId: string,
  ) {
    const data = await this.bookService.toggleFavorite(userId, bookId);
    return {
      status: 'success',
      message: 'Статус избранного изменен',
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создать новую книгу (Admin/Librarian)' })
  async createBook(@Body() dto: CreateBookDto) {
    const data = await this.bookService.createBook(dto);
    return { status: 'success', data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Обновить данные книги' })
  async updateBook(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    const data = await this.bookService.updateBook(id, dto);
    return { status: 'success', data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить книгу' })
  async deleteBook(@Param('id') id: string) {
    await this.bookService.deleteBook(id);
  }

  @Post(':id/cover')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Загрузить обложку книги' })
  async uploadCover(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.bookService.uploadBookCover(id, file);
  }
}
