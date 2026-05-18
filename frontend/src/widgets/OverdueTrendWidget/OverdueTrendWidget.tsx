import { FC, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'
import type { WidgetGridProps } from '@entities/widgets-grid/types'
import { toStatsQuery, DEFAULT_WIDGET_RANGE } from '@entities/statistic/lib/statsQuery'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import { ChartBox } from '@shared/components/ChartMeasure'
import { useAdminOverdue } from '@entities/statistic/hooks/useAdminOverdue'
import {
  buildWidgetHeaderExtras,
  getWidgetRangeSubtitle,
} from '@widgets/LibrarianDashboardTab/model/widgetRangeProps'
import styles from './OverdueTrendWidget.module.scss'

const COLORS = ['#FFD60A', '#FF9F0A', '#FF453A', '#8E8E93']

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const data = payload[0].payload
    const cellColor = payload[0].color

    return (
      <div className={styles.customTooltip}>
        <div className={styles.label}>{data.label}</div>
        <div className={styles.valueContainer}>
          <div
            className={styles.indicator}
            style={{ backgroundColor: cellColor }}
          />
          <div className={styles.value}>{payload[0].value} шт.</div>
        </div>
      </div>
    )
  }
  return null
}

export const OverdueTrendWidget: FC<WidgetGridProps> = props => {
  const { isEditing, isDragging, isResizing, rangeConfig, onRangeChange } =
    props

  const range = rangeConfig ?? DEFAULT_WIDGET_RANGE
  const statsQuery = useMemo(() => toStatsQuery(range), [range])
  const { data, isLoading } = useAdminOverdue(statsQuery)
  const isEmpty = !isLoading && (!data || data.length === 0)

  return (
    <WidgetWrapper
      id="2"
      title="Анализ просрочек"
      subtitle={getWidgetRangeSubtitle(props, 'Распределение по срокам')}
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="Просроченных заказов нет"
      isEditing={isEditing}
      isDragging={isDragging}
      isResizing={isResizing}
      headerContent={buildWidgetHeaderExtras('2', {
        rangeConfig: range,
        onRangeChange,
        isEditing,
      }, { allowToday: false })}
    >
      <ChartBox className={styles.chart}>
        <BarChart
          data={data ?? []}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
        >
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            dy={8}
            tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
          />
          <YAxis hide />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255, 255, 255, 0.03)', radius: 10 }}
            animationDuration={200}
          />
          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            barSize={32}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {(data ?? []).map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ChartBox>
    </WidgetWrapper>
  )
}
