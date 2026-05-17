import { useMemo } from 'react'
import type { WidgetConfig } from '@features/widget-builder/model/useWidgetBuilderStore'
import { useAdminOverview } from '@entities/statistic/hooks/useAdminOverview'
import { useAdminDynamics } from '@entities/statistic/hooks/useAdminDynamics'
import { useAdminOverdue } from '@entities/statistic/hooks/useAdminOverdue'
import { useAdminIssuanceByGenre } from '@entities/statistic/hooks/useAdminIssuanceByGenre'

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ожидает',
  APPROVED: 'Одобрен',
  READY_TO_PICKUP: 'К выдаче',
  ON_HAND: 'На руках',
  OVERDUE: 'Просрочен',
  RETURNED: 'Возвращён',
  CANCELLED: 'Отменён',
}

const rangeToMs: Record<WidgetConfig['range'], number> = {
  week: 7 * 86400000,
  month: 30 * 86400000,
  year: 365 * 86400000,
}

export interface ChartPoint {
  name: string
  value: number
  issued?: number
  returned?: number
}

export const useDynamicWidgetChart = (config: WidgetConfig) => {
  const queryParams = useMemo(
    () => ({
      from: new Date(Date.now() - rangeToMs[config.range]).toISOString(),
    }),
    [config.range],
  )

  const overviewDay = useMemo(
    () => ({ from: new Date(Date.now() - 86400000).toISOString() }),
    [],
  )

  const genres = useAdminIssuanceByGenre(queryParams)
  const workload = useAdminDynamics(queryParams)
  const overdue = useAdminOverdue()
  const overview = useAdminOverview(
    config.source === 'overview_activity' ? overviewDay : queryParams,
  )

  const isLoading =
    genres.isLoading ||
    workload.isLoading ||
    overdue.isLoading ||
    overview.isLoading

  const data: ChartPoint[] = useMemo(() => {
    switch (config.source) {
      case 'popular_genres':
        return (
          genres.data?.genres.slice(0, 8).map(g => ({
            name: g.label,
            value: g.totalQuantity,
          })) ?? []
        )
      case 'workload':
        return (
          workload.data?.data.map(row => ({
            name: new Date(row.date).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
            }),
            value: row.issued,
            issued: row.issued,
            returned: row.returned,
          })) ?? []
        )
      case 'overdue':
        return (
          overdue.data?.map(row => ({
            name: row.label,
            value: row.value,
          })) ?? []
        )
      case 'orders_status':
        return (
          overview.data?.ordersByStatus.map(row => ({
            name: ORDER_STATUS_LABELS[row.status] ?? row.status,
            value: row.count,
          })) ?? []
        )
      case 'overview_activity':
        if (!overview.data) return []
        return [
          { name: 'Читатели', value: overview.data.newUsersInRange },
          { name: 'Заказы', value: overview.data.ordersInRange },
          { name: 'Выдачи', value: overview.data.orderItemsQuantitySum },
          { name: 'Отзывы', value: overview.data.reviewsInRange },
        ]
      default:
        return []
    }
  }, [config.source, genres.data, workload.data, overdue.data, overview.data])

  return { data, isLoading, isEmpty: !isLoading && data.length === 0 }
}
