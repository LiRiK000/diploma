import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AchievementCategory, Prisma } from '@prisma/client';
import { GAMIFICATION_CONFIG, RANKS } from './gamification.constants';

type PrismaTransaction = Prisma.TransactionClient;

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  private getThresholdForLevel(level: number): number {
    if (level <= 0) return GAMIFICATION_CONFIG.BASE_EXP;
    return Math.floor(
      GAMIFICATION_CONFIG.BASE_EXP *
        Math.pow(level, GAMIFICATION_CONFIG.LEVEL_EXP_EXPONENT),
    );
  }

  getRankTitle(level: number): string {
    const rank = [...RANKS].reverse().find((r) => level >= r.minLevel);
    return rank ? rank.title : 'Путешественник';
  }

  async handleUserActivity(
    userId: string,
    payload: {
      expToAdd: number;
      category?: AchievementCategory;
      incrementValue?: number;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { experience: true, level: true },
      });

      if (!user) return;

      let newExp = user.experience + payload.expToAdd;
      let newLevel = user.level;

      while (newExp >= this.getThresholdForLevel(newLevel)) {
        newExp -= this.getThresholdForLevel(newLevel);
        newLevel++;
      }

      const isLevelUp = newLevel > user.level;

      await tx.user.update({
        where: { id: userId },
        data: { experience: newExp, level: newLevel },
      });

      if (payload.category && payload.incrementValue) {
        await this.processAchievements(
          tx,
          userId,
          payload.category,
          payload.incrementValue,
        );
      }

      if (isLevelUp) {
        await tx.notification.create({
          data: {
            userId,
            message: `🎉 Уровень повышен! Теперь вы ${newLevel} уровня (${this.getRankTitle(newLevel)}).`,
          },
        });
      }

      return { newLevel, newExp, isLevelUp };
    });
  }

  private async processAchievements(
    tx: PrismaTransaction,
    userId: string,
    category: AchievementCategory,
    _increment: number,
  ) {
    const userStats = await tx.user.findUnique({
      where: { id: userId },
      select: {
        _count: {
          select: {
            readBooks: true,
            reviews: true,
            followedAuthors: true,
            orders: true,
          },
        },
      },
    });

    if (!userStats) return;

    const pendingAchievements = await tx.achievement.findMany({
      where: {
        category,
        users: {
          none: { userId, isCompleted: true },
        },
      },
    });

    for (const ach of pendingAchievements) {
      let actualValue = 0;

      switch (category) {
        case AchievementCategory.READING:
          actualValue = userStats._count.readBooks;
          break;

        case AchievementCategory.SOCIAL:
          const isFollowAch =
            ach.title.toLowerCase().includes('автор') ||
            ach.description.toLowerCase().includes('подпиш');
          actualValue = isFollowAch
            ? userStats._count.followedAuthors
            : userStats._count.reviews;
          break;

        case AchievementCategory.SYSTEM:
          actualValue = userStats._count.orders;
          break;
      }

      const userAch = await tx.userAchievement.upsert({
        where: { userId_achievementId: { userId, achievementId: ach.id } },
        update: { currentValue: actualValue },
        create: { userId, achievementId: ach.id, currentValue: actualValue },
      });

      if (userAch.currentValue >= ach.targetValue && !userAch.isCompleted) {
        await tx.userAchievement.update({
          where: { id: userAch.id },
          data: { isCompleted: true, completedAt: new Date() },
        });

        await tx.user.update({
          where: { id: userId },
          data: { experience: { increment: ach.rewardExp } },
        });

        await tx.notification.create({
          data: {
            userId,
            message: `🏅 Достижение получено: "${ach.title}"! +${ach.rewardExp} XP`,
          },
        });
      }
    }
  }
}
