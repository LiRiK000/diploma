import { api } from '@shared/api'
import { Achievement, UserStats } from '@entities/gamification/model/types'

export class GamificationService {
  async getMyStats(): Promise<UserStats> {
    const response = await api.get('/gamification/my-stats')
    return response.data
  }

  async getAchievements(): Promise<Achievement[]> {
    const response = await api.get('/gamification/achievements')
    return response.data
  }

  async markAchievementAsViewed(achievementId: string): Promise<void> {
    await api.patch(`/gamification/achievements/${achievementId}/view`)
  }
}

export const gamificationService = new GamificationService()
