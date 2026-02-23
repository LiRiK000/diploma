import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { LoginDto, RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/generated/prisma/client';
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
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser)
      throw new BadRequestException('Пользователь уже существует');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
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
  // МЕТОД ЛОГАУТА
  async logout(userId: string, res: Response) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { status: 'success', message: 'Вы успешно вышли' };
  }

  private async createSendTokens(user: User, res: Response) {
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
