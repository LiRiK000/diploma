// entities/statistic/lib/useAdminOverview.ts
import { useQuery } from '@tanstack/react-query'
import { StatsRangeQueryDto } from '../model/types'
import { statisticService } from '@shared/services/StatisticService'

export const useAdminOverview = (query: StatsRangeQueryDto) => {
  return useQuery({
    queryKey: ['admin-stats-overview', query],
    queryFn: () => statisticService.getAdminOverview(query),
    staleTime: 5 * 60 * 1000,
  })
}
