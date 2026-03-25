import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto/author.dto';
import { FileService } from 'src/common/file/file.service';

@Injectable()
export class AuthorsService {
  private readonly s3PublicUrl = process.env.S3_PUBLIC_URL;

  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  private getFullUrl(path: string | null): string {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${this.s3PublicUrl}/${path}`;
  }

  async findAll(excludeIds: string[] = [], limit: number = 10) {
    const authors = await this.prisma.author.findMany({
      where: { id: { notIn: excludeIds } },
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        dateOfDeath: true,
        photoUrl: true,
        _count: { select: { books: true } },
      },
    });

    return {
      status: 'success',
      data: authors.map((a) => ({
        ...a,
        fullName: `${a.firstName} ${a.lastName}`,
        photoUrl: this.getFullUrl(a.photoUrl),
      })),
    };
  }

  async findOne(id: string, currentUserId?: string) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: { _count: { select: { followers: true } } },
    });
    if (!author) throw new NotFoundException('Автор не найден');

    const isFollowing = currentUserId
      ? await this.prisma.user.findFirst({
          where: { id: currentUserId, followedAuthors: { some: { id } } },
        })
      : null;

    const topBooks = await this.prisma.book.findMany({
      where: { authorId: id },
      take: 6,
      include: { author: true, genre: true },
    });

    return {
      status: 'success',
      data: {
        ...author,
        fullName: `${author.firstName} ${author.lastName}`,
        photoUrl: this.getFullUrl(author.photoUrl),
        followersCount: author._count.followers,
        isFollowing: !!isFollowing,
        topBooks: topBooks.map((b) => ({
          ...b,
          author: `${b.author.firstName} ${b.author.lastName}`,
          genre: b.genre.label,
          coverUrl: this.getFullUrl(b.coverImage),
        })),
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
      return this.prisma.author.update({
        where: { id: author.id },
        data: { photoUrl: path },
      });
    }

    return author;
  }

  async update(id: string, dto: UpdateAuthorDto, file?: Express.Multer.File) {
    const existing = await this.prisma.author.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Автор не найден');

    let photoUrl = existing.photoUrl;
    if (file) {
      photoUrl = await this.fileService.uploadImage(file, 'authors', id);
    }

    return this.prisma.author.update({
      where: { id },
      data: {
        ...dto,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        dateOfDeath: dto.dateOfDeath ? new Date(dto.dateOfDeath) : undefined,
        photoUrl,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.author.delete({ where: { id } });
    return { status: 'success' };
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

    return { status: 'success', isFollowing: !isAlreadyFollowing };
  }

  async bulkFollow(userId: string, authorIds: string[]) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { followedAuthors: { connect: authorIds.map((id) => ({ id })) } },
    });
  }

  async uploadAuthorPhoto(authorId: string, file: Express.Multer.File) {
    const path = await this.fileService.uploadImage(file, 'authors', authorId);
    return this.prisma.author.update({
      where: { id: authorId },
      data: { photoUrl: path },
    });
  }
}
