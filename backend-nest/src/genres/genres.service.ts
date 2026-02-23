import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenreDto } from './dto/genre.dto';
@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const genres = await this.prisma.genre.findMany({
      select: { id: true, value: true, label: true },
      orderBy: { label: 'asc' },
    });
    return {
      status: 'success',
      results: genres.length,
      data: genres,
    };
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException('Жанр не найден');
    return { status: 'success', data: genre };
  }

  async create(dto: GenreDto) {
    const genre = await this.prisma.genre.create({ data: dto });
    return { status: 'success', data: genre };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.genre.delete({ where: { id } });
    return { status: 'success', data: null };
  }
}
