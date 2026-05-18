import { useQuery } from '@tanstack/react-query'
import type { StatsRangeQueryDto } from '../model/types'
import { statisticService } from '@shared/services/StatisticService'

export const useAdminOverdue = (query: StatsRangeQueryDto) => {
  return useQuery({
    queryKey: ['admin-stats-overdue', query],
    queryFn: () => statisticService.getAdminOverdueAnalytics(query),
    staleTime: 5 * 60 * 1000,
  })
}
