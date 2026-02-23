import { Body, Controller, Post, Res, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/register.dto';
import * as express from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { User } from 'src/generated/prisma/client';
import { CurrentUser } from './decorators/current-user.decorator';
import { Cookie } from 'src/common/decorators/get-cookies.decorator';

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
  getMe(@CurrentUser() user: User) {
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
