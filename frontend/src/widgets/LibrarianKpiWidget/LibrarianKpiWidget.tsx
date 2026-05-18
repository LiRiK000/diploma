import { FC, useMemo } from 'react'
import type { WidgetGridProps } from '@entities/widgets-grid/types'
import { toStatsQuery, DEFAULT_KPI_RANGE } from '@entities/statistic/lib/statsQuery'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import {
  buildWidgetHeaderExtras,
  getWidgetRangeSubtitle,
} from '@widgets/LibrarianDashboardTab/model/widgetRangeProps'
import styles from './LibrarianKpiWidget.module.scss'
import { useFetchData } from './hooks/useFetchData'

export const LIBRARIAN_KPI_WIDGET_ID = '1' as const

export const LibrarianKpiWidget: FC<WidgetGridProps> = props => {
  const { isEditing, isDragging, isResizing, rangeConfig, onRangeChange } =
    props

  const range = rangeConfig ?? DEFAULT_KPI_RANGE
  const statsQuery = useMemo(() => toStatsQuery(range), [range])
  const { data, isLoading } = useFetchData(statsQuery)
  const overdueCount = data?.overdue ?? 0

  return (
    <WidgetWrapper
      id={LIBRARIAN_KPI_WIDGET_ID}
      title="Сводка по смене"
      subtitle={getWidgetRangeSubtitle(props, 'Показатели за сегодня')}
      isLoading={isLoading}
      isEmpty={!data}
      emptyMessage="Нет данных"
      isEditing={isEditing}
      isDragging={isDragging}
      isResizing={isResizing}
      headerContent={buildWidgetHeaderExtras(LIBRARIAN_KPI_WIDGET_ID, {
        rangeConfig: range,
        onRangeChange,
        isEditing,
      })}
    >
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.label}>Активные заявки</div>
          <div className={styles.value}>{data?.activeOrders ?? 0}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Выдано</div>
          <div className={styles.value}>{data?.issuedToday ?? 0}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Возвраты</div>
          <div className={styles.value}>{data?.returnsToday ?? 0}</div>
        </div>
        <div
          className={`${styles.card} ${overdueCount > 0 ? styles.cardDanger : ''}`}
        >
          <div className={styles.label}>Просрочено</div>
          <div className={styles.value}>{overdueCount}</div>
        </div>
      </div>
    </WidgetWrapper>
  )
}
