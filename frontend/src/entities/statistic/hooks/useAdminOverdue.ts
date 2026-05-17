import { useQuery } from '@tanstack/react-query'
import { statisticService } from '@shared/services/StatisticService'
import { OverdueAnalyticsResponse } from '../model/types'

export const useAdminOverdue = () => {
  return useQuery<OverdueAnalyticsResponse>({
    queryKey: ['admin-stats-overdue'],
    queryFn: () => statisticService.getAdminOverdueAnalytics(),
    staleTime: 10 * 60 * 1000,
  })
}
