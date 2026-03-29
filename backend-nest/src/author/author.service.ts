import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto/author.dto';
import { FileService } from 'src/common/file/file.service';
import { getFullUrl } from 'src/utils/getFullCoverUrl';
import { Author, Book, Genre } from '@prisma/client';

type AuthorWithRelations = Author & {
  books?: (Book & {
    author: Author;
    genre: Genre;
  })[];
  _count?: {
    books?: number;
    followers?: number;
  };
};

@Injectable()
export class AuthorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  private formatAuthor(author: AuthorWithRelations) {
    return {
      ...author,
      fullName: `${author.firstName} ${author.lastName}`,
      dateOfBirth: author.dateOfBirth.toISOString(),
      dateOfDeath: author.dateOfDeath ? author.dateOfDeath.toISOString() : null,
      createdAt: author.createdAt.toISOString(),
      updatedAt: author.updatedAt.toISOString(),

      photoUrl: getFullUrl(author.photoUrl),

      topBooks: author.books?.map((b) => ({
        ...b,
        author: `${b.author.firstName} ${b.author.lastName}`,
        genre: b.genre.label,
        coverUrl: getFullUrl(b.coverImage),
      })),
    };
  }

  async findAll(excludeIds: string[] = [], limit?: number) {
    const authors = await this.prisma.author.findMany({
      where: {
        id: { notIn: excludeIds },
      },
      take: limit,
      include: {
        _count: { select: { books: true } },
      },
    });

    return {
      status: 'success',
      data: authors.map((a) => this.formatAuthor(a as AuthorWithRelations)),
    };
  }

  async findOne(id: string, currentUserId?: string) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        _count: { select: { followers: true } },
        books: {
          take: 6,
          include: { author: true, genre: true },
        },
      },
    });

    if (!author) throw new NotFoundException('Автор не найден');

    const isFollowing = currentUserId
      ? await this.prisma.user.findFirst({
          where: { id: currentUserId, followedAuthors: { some: { id } } },
        })
      : null;

    const formatted = this.formatAuthor(author as AuthorWithRelations);

    return {
      status: 'success',
      data: {
        ...formatted,
        followersCount: author._count.followers,
        isFollowing: !!isFollowing,
      },
    };
  }

  async create(dto: CreateAuthorDto, file?: Express.Multer.File) {
    const author = await this.prisma.author.create({
      data: {
        ...dto,
        dateOfBirth: new Date(dto.dateOfBirth),
        dateOfDeath: dto.dateOfDeath ? new Date(dto.dateOfDeath) : null,
      },
    });

    if (file) {
      const path = await this.fileService.uploadImage(
        file,
        'authors',
        author.id,
      );
      const updated = await this.prisma.author.update({
        where: { id: author.id },
        data: { photoUrl: path },
      });
      return this.formatAuthor(updated as AuthorWithRelations);
    }

    return this.formatAuthor(author as AuthorWithRelations);
  }

  async update(id: string, dto: UpdateAuthorDto, file?: Express.Multer.File) {
    const existing = await this.prisma.author.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Автор не найден');
    const { dateOfBirth, dateOfDeath, ...cleanDto } = dto;

    let newPhotoPath: string | undefined;
    if (file) {
      newPhotoPath = await this.fileService.uploadImage(file, 'authors', id);
    }
    const updated = await this.prisma.author.update({
      where: { id },
      data: {
        ...cleanDto,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        dateOfDeath: dateOfDeath
          ? new Date(dateOfDeath)
          : dateOfDeath === null
            ? null
            : undefined,
        photoUrl: newPhotoPath ?? undefined,
      },
    });

    return this.formatAuthor(updated as AuthorWithRelations);
  }

  async delete(id: string) {
    const existing = await this.prisma.author.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Автор не найден');

    await this.prisma.author.delete({ where: { id } });
    return { status: 'success' };
  }

  async toggleFollow(authorId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { followedAuthors: { where: { id: authorId } } },
    });

    const isAlreadyFollowing = (user?.followedAuthors.length ?? 0) > 0;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        followedAuthors: isAlreadyFollowing
          ? { disconnect: { id: authorId } }
          : { connect: { id: authorId } },
      },
    });

    return { status: 'success', isFollowing: !isAlreadyFollowing };
  }

  async bulkFollow(userId: string, authorIds: string[]) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { followedAuthors: { connect: authorIds.map((id) => ({ id })) } },
    });
  }
}
