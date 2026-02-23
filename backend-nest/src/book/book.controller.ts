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
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getBooks(
    @Query('take') take?: string,
    @Query('cursor') cursor?: string,
  ) {
    const data = await this.bookService.getPaginatedBooks(
      Number(take) || 8,
      cursor,
    );

    return {
      status: 'success',
      data,
    };
  }

  @Get(':id')
  async getBook(@Param('id') id: string) {
    const data = await this.bookService.getBookById(id);

    return {
      status: 'success',
      data,
    };
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async createBook(@Body() dto: CreateBookDto) {
    const data = await this.bookService.createBook(dto);

    return {
      status: 'success',
      data,
    };
  }

  // @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateBook(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    const data = await this.bookService.updateBook(id, dto);

    return {
      status: 'success',
      data,
    };
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBook(@Param('id') id: string) {
    await this.bookService.deleteBook(id);
  }
  @Post(':id/cover')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCover(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.bookService.uploadBookCover(id, file);
  }
}
