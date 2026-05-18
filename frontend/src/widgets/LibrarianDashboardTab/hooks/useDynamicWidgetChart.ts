import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { WidgetConfig } from '@features/widget-builder/model/useWidgetBuilderStore'
import type { WidgetRangeConfig } from '@entities/statistic/lib/statsQuery'
import { toStatsQuery } from '@entities/statistic/lib/statsQuery'
import { statisticService } from '@shared/services/StatisticService'
import type { ChartPoint } from '../model/types'

export type { ChartPoint } from '../model/types'

export function widgetConfigToRange(config: WidgetConfig): WidgetRangeConfig {
  return {
    preset: config.range,
    from: config.from,
    to: config.to,
  }
}

/** Данные для пользовательских виджетов — единый эндпоинт бэкенда */
export function useDynamicWidgetChart(config: WidgetConfig) {
  const range = widgetConfigToRange(config)
  const statsQuery = useMemo(() => toStatsQuery(range), [range])

  const { data, isLoading } = useQuery({
    queryKey: ['dynamic-widget', config.source, statsQuery],
    queryFn: () =>
      statisticService.getDynamicWidget(config.source, statsQuery),
    staleTime: 5 * 60 * 1000,
  })

  const chartData: ChartPoint[] = useMemo(() => {
    if (!data) return []
    return data.map(row => ({
      name: row.name,
      value: row.value,
      issued: row.issued,
      returned: row.returned,
    }))
  }, [data])

  return {
    data: chartData,
    isLoading,
    isEmpty: !isLoading && chartData.length === 0,
  }
}
