export type AchievementCategory = 'READING' | 'SOCIAL' | 'SYSTEM'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: AchievementCategory
  targetValue: number
  currentValue: number
  isCompleted: boolean
  rewardExp: number
  completedAt?: string | null
}

export interface UserStats {
  level: number
  experience: number
  nextLevelExp: number
  progressPercentage: number
  rank: string
}

export interface GamificationData {
  stats: UserStats
  achievements: Achievement[]
}
