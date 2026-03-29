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
        _count: { select: { readBooks: true } },
      },
    });

    const nextLevelThreshold = this.gamificationService['getThresholdForLevel'](
      user.level,
    );

    return {
      level: user.level,
      rank: this.gamificationService.getRankTitle(user.level),
      currentExp: user.experience,
      nextLevelExp: nextLevelThreshold,
      progressPercent: Math.min(
        Math.round((user.experience / nextLevelThreshold) * 100),
        100,
      ),
      totalReadBooks: user._count.readBooks,
    };
  }

  @Get('achievements')
  async getAchievements(@CurrentUser('id') userId: string) {
    const allAchievements = await this.prisma.achievement.findMany({
      include: {
        users: {
          where: { userId },
        },
      },
    });

    return allAchievements.map((ach) => ({
      id: ach.id,
      title: ach.title,
      description: ach.description,
      icon: ach.icon,
      category: ach.category,
      targetValue: ach.targetValue,
      currentValue: ach.users[0]?.currentValue ?? 0,
      isCompleted: ach.users[0]?.isCompleted ?? false,
      rewardExp: ach.rewardExp,
      completedAt: ach.users[0]?.completedAt ?? null,
    }));
  }
}
