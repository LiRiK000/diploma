import { Injectable } from '@nestjs/common';
import { GAMIFICATION_CONFIG, RANKS } from './gamification.constants';

@Injectable()
export class GamificationService {
  getThresholdForLevel(level: number): number {
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

  calculateProgress(
    currentExp: number,
    currentLevel: number,
    booksCount: number,
  ) {
    const gainedExp = booksCount * GAMIFICATION_CONFIG.EXP_PER_BOOK;
    let newExp = currentExp + gainedExp;
    let newLevel = currentLevel;

    while (newExp >= this.getThresholdForLevel(newLevel)) {
      newExp -= this.getThresholdForLevel(newLevel);
      newLevel++;
    }

    return {
      experience: newExp,
      level: newLevel,
      gainedExp,
      isLevelUp: newLevel > currentLevel,
    };
  }

  // Метод для отдачи данных на фронт
  async getUserStats(user: {
    experience: number;
    level: number;
    _count?: { readBooks: number };
  }) {
    const nextLevelThreshold = this.getThresholdForLevel(user.level);
    const progressPercent = Math.round(
      (user.experience / nextLevelThreshold) * 100,
    );

    return {
      level: user.level,
      currentExp: user.experience,
      nextLevelExp: nextLevelThreshold,
      progressPercent,
      rank: this.getRankTitle(user.level),
      totalReadBooks: user._count?.readBooks ?? 0,
    };
  }
}
