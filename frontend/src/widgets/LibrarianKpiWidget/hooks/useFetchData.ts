import { useQuery } from '@tanstack/react-query'
import type { StatsRangeQueryDto } from '@entities/statistic/model/types'
import { statisticService } from '@shared/services/StatisticService'

export const useFetchData = (query: StatsRangeQueryDto) => {
  return useQuery({
    queryKey: ['librarian-shift-kpi', query],
    queryFn: () => statisticService.getAdminShiftKpi(query),
    staleTime: 60_000,
  })
}
