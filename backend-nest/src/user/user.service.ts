import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileService } from 'src/common/file/file.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { getFullUrl } from 'src/utils/getFullCoverUrl';
import { userFullProfileSelect } from './select/user-full-profile.select';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userFullProfileSelect,
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return {
      ...user,
      avatarUrl: getFullUrl(user.avatarUrl),
    };
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      },
      select: userFullProfileSelect,
    });

    return {
      ...user,
      avatarUrl: getFullUrl(user.avatarUrl),
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
      avatarUrl: getFullUrl(user.avatarUrl),
    };
  }
}
