import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { type User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { NotificationsService } from 'src/notifications/notifications.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateMeDto } from './dto/update-me.dto';

import { Env } from 'src/config/env.schema';

interface JwtPayload {
  id: string;
  role?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly notifications: NotificationsService,
  ) {}

  async register(dto: RegisterDto, res: Response) {
    const { password, birthDate, ...data } = dto;

    await this.validateUniqueness(data.email, data.phone);

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    });

    const welcomeName =
      user.displayName?.trim() ||
      [user.name, user.surname].filter(Boolean).join(' ').trim() ||
      user.name;
    await this.notifications.notifyWelcome(user.id, welcomeName);

    return this.createSendTokens(user, res);
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return this.createSendTokens(user, res);
  }

  async getUserFullProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        birthDate: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async refresh(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token не найден');
    }

    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET');

      if (!refreshSecret) {
        throw new Error('JWT_REFRESH_SECRET is not defined');
      }

      const payloadUnknown: unknown = this.jwtService.verify(refreshToken, {
        secret: refreshSecret,
      });

      const payload = payloadUnknown as JwtPayload;

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Невалидный refresh токен');
      }

      return this.createSendTokens(user, res);
    } catch {
      throw new UnauthorizedException(
        'Невалидный или просроченный refresh токен',
      );
    }
  }

  async logout(userId: string, res: Response) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return {
      message: 'Успешный выход',
    };
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    if (dto.phone) {
      await this.validateUniqueness('', dto.phone, userId);
    }

    return this.userService.updateProfile(userId, dto);
  }

  private async validateUniqueness(
    email: string,
    phone?: string,
    userId?: string,
  ) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, ...(phone ? [{ phone }] : [])],
        NOT: userId
          ? {
              id: userId,
            }
          : undefined,
      },
    });

    if (existing) {
      const field = existing.email === email ? 'email' : 'номер телефона';

      throw new BadRequestException(`Этот ${field} уже используется`);
    }
  }

  private async createSendTokens(
    user: Pick<User, 'id' | 'email' | 'role'>,
    res: Response,
  ) {
    const accessToken = this.jwtService.sign({
      id: user.id,
      role: user.role,
    });

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        secret: refreshSecret,
        expiresIn: '7d',
      },
    );

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
