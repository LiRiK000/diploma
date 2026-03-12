import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import * as express from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import type { User } from '@prisma/client';
import { CurrentUser } from './decorators/current-user.decorator';
import { Cookie } from 'src/common/decorators/get-cookies.decorator';
import { LoginDto } from './dto/login.dto';
import { UpdateMeDto } from './dto/update-me.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return this.authService.register(dto, res);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return this.authService.login(dto, res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser('id') userId: string) {
    // Вызываем сервис, чтобы получить свежие данные из БД
    const user = await this.authService.getUserFullProfile(userId);
    return {
      status: 'success',
      data: { user },
    };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateMeDto) {
    const user = await this.authService.updateMe(userId, dto);
    return {
      status: 'success',
      data: { user },
    };
  }

  @Post('refresh-token')
  async refreshTokens(
    @Cookie('refreshToken') token: string | undefined,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return this.authService.refresh(token, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    await this.authService.logout(userId, res);
    return {
      status: 'success',
      message: 'Logged out successfully',
    };
  }
}
