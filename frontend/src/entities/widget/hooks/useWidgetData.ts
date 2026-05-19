import { useQuery } from '@tanstack/react-query'
import { StatsRangeQueryDto } from '@entities/statistic/model/types'
import { dashboardService } from '@shared/services/WidgetsService/WidgetsService'

export const useWidgetData = (id: string, query: StatsRangeQueryDto) => {
  return useQuery({
    queryKey: ['widget-data', id, query.range],
    queryFn: () => dashboardService.getWidgetData(id, query),
    enabled: !!id,
    staleTime: 60000,
  })
}
