import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileService } from 'src/common/file/file.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly s3PublicUrl = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');

  private readonly userSelect = {
    id: true,
    email: true,
    name: true,
    surname: true,
    displayName: true,
    phone: true,
    birthDate: true,
    gender: true,
    avatarUrl: true,
    role: true,
    createdAt: true,
    _count: {
      select: { favoriteBooks: true, readBooks: true },
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  private getFullUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;

    const base = this.s3PublicUrl || '';
    const bucket = process.env.S3_BUCKET || 'covers';

    const cleanPath = path.replace(/^\//, '');

    if (cleanPath.startsWith(`${bucket}/`)) {
      return `${base}/${cleanPath}`;
    }

    return `${base}/${bucket}/${cleanPath}`;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.userSelect,
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      ...user,
      avatarUrl: this.getFullUrl(user.avatarUrl),
    };
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      },
      select: this.userSelect,
    });

    return {
      ...user,
      avatarUrl: this.getFullUrl(user.avatarUrl),
    };
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const path = await this.fileService.uploadImage(file, 'avatar', userId);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: path },
      select: { avatarUrl: true },
    });

    return {
      status: 'success',
      avatarUrl: this.getFullUrl(user.avatarUrl),
    };
  }
}
