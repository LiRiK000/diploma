import { gamificationService } from '@shared/services/GamificationService'
import { useQuery } from '@tanstack/react-query'

export const gamificationKeys = {
  all: ['gamification'] as const,
  stats: () => [...gamificationKeys.all, 'stats'] as const,
  achievements: () => [...gamificationKeys.all, 'achievements'] as const,
}

export const useUserStats = () => {
  return useQuery({
    queryKey: gamificationKeys.stats(),
    queryFn: () => gamificationService.getMyStats(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAchievements = () => {
  return useQuery({
    queryKey: gamificationKeys.achievements(),
    queryFn: () => gamificationService.getAchievements(),
  })
}
