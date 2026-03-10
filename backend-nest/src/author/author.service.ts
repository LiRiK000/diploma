import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/author.dto';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(excludeIds: string[] = [], limit: number = 10) {
    const authors = await this.prisma.author.findMany({
      where: {
        id: {
          notIn: excludeIds,
        },
      },
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        dateOfDeath: true,
        _count: { select: { books: true } },
      },
    });

    return {
      status: 'success',
      results: authors.length,
      data: authors.map((a) => ({
        ...a,
        fullName: `${a.firstName} ${a.lastName}`,
      })),
    };
  }

  async findOne(id: string, currentUserId?: string) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        _count: { select: { followers: true } },
      },
    });

    if (!author) throw new NotFoundException('Автор не найден');

    const isFollowing = currentUserId
      ? await this.prisma.user.findFirst({
          where: {
            id: currentUserId,
            followedAuthors: { some: { id: id } },
          },
        })
      : null;

    const topBooksData = await this.prisma.book.findMany({
      where: { authorId: id },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        genre: true,
      },
    });

    return {
      status: 'success',
      data: {
        ...author,
        fullName: `${author.firstName} ${author.lastName}`,
        followersCount: author._count.followers,
        isFollowing: !!isFollowing,
        topBooks: topBooksData.map((book) => ({
          ...book,
          author: `${book.author.firstName} ${book.author.lastName}`,
          genre: book.genre.label,
        })),
      },
    };
  }

  async bulkFollow(userId: string, authorIds: string[]) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        followedAuthors: {
          connect: authorIds.map((id) => ({ id })),
        },
      },
    });
  }

  async create(dto: CreateAuthorDto) {
    const author = await this.prisma.author.create({
      data: {
        ...dto,
        dateOfBirth: new Date(dto.dateOfBirth),
        dateOfDeath: dto.dateOfDeath ? new Date(dto.dateOfDeath) : null,
      },
    });
    return { status: 'success', data: author };
  }

  async toggleFollow(authorId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { followedAuthors: { where: { id: authorId } } },
    });

    const isAlreadyFollowing = user?.followedAuthors.length > 0;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        followedAuthors: isAlreadyFollowing
          ? { disconnect: { id: authorId } }
          : { connect: { id: authorId } },
      },
    });

    return {
      status: 'success',
      isFollowing: !isAlreadyFollowing,
      message: isAlreadyFollowing ? 'Вы отписались' : 'Вы подписались',
    };
  }
}
