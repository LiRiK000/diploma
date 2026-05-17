import { useQuery } from '@tanstack/react-query'
import { StatsRangeQueryDto } from '../model/types'
import { statisticService } from '@shared/services/StatisticService'

export const useAdminDynamics = (query: StatsRangeQueryDto) => {
  return useQuery({
    queryKey: ['admin-stats-dynamics', query],
    queryFn: () => statisticService.getAdminDynamics(query),
    staleTime: 5 * 60 * 1000,
  })
}
