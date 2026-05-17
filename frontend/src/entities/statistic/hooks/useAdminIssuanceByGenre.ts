import { useQuery } from '@tanstack/react-query'
import { StatsRangeQueryDto } from '../model/types'
import { statisticService } from '@shared/services/StatisticService'

export const useAdminIssuanceByGenre = (query: StatsRangeQueryDto) => {
  return useQuery({
    queryKey: ['admin-stats-genres', query],
    queryFn: () => statisticService.getAdminIssuanceByGenre(query),
    staleTime: 5 * 60 * 1000,
  })
}
