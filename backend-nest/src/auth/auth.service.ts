import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto, res: Response) {
    const { email, password, phone, birthDate, ...otherData } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser)
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );

    if (phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhone)
        throw new BadRequestException('Этот номер телефона уже используется');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
        ...otherData,
      },
    });

    return this.createSendTokens(user, res);
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Неверный email или пароль');

    return this.createSendTokens(user, res);
  }

  async getUserFullProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException('Пользователь не найден');

    const { password, refreshToken, ...publicUser } = user;
    return publicUser;
  }

  async refresh(refreshToken: string, res: Response) {
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token не найден');

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException(
        `Невалидный или просроченный refresh token ${error}`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Доступ запрещен');
    }

    return this.createSendTokens(user, res);
  }
  async logout(userId: string, res: Response) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { status: 'success', message: 'Вы успешно вышли' };
  }

  private async createSendTokens(
    user: Pick<User, 'id' | 'email' | 'role'>,
    res: Response,
  ) {
    const accessToken = this.jwtService.sign(
      { id: user.id, role: user.role },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { id: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    };

    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);

    return { id: user.id, email: user.email, role: user.role };
  }
}
