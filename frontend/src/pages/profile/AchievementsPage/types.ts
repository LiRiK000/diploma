export type AchievementCategory = 'READING' | 'SOCIAL' | 'SYSTEM'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  currentValue: number
  targetValue: number
  isCompleted: boolean
  rewardExp: number
  category: AchievementCategory
  completedAt?: string | null
}

export interface UserGamificationStats {
  level: number
  rank: string
  currentExp: number
  nextLevelExp: number
  progressPercent: number
  totalReadBooks: number
}
