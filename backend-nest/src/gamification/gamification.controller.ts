import { Controller, Get, UseGuards } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('gamification')
export class GamificationController {
  constructor(
    private readonly gamificationService: GamificationService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('my-stats')
  async getMyStats(@CurrentUser('id') userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        experience: true,
        level: true,
        _count: {
          select: { readBooks: true },
        },
      },
    });

    return this.gamificationService.getUserStats(user);
  }
}
