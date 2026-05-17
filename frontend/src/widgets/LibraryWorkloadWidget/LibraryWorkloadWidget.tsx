import { FC, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { FullScreenButton } from '@entities/widgets-grid'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import { ChartBox } from '@shared/components/ChartMeasure'
import { useAdminDynamics } from '@entities/statistic/hooks/useAdminDynamics'
import styles from './LibraryWorkloadWidget.module.scss'

export const LibraryWorkloadWidget: FC<any> = ({
  isEditing,
  isDragging,
  isResizing,
}) => {
  const queryParams = useMemo(
    () => ({
      from: new Date(Date.now() - 7 * 86400000).toISOString(),
    }),
    [],
  )

  const { data, isLoading } = useAdminDynamics(queryParams)
  const chartData = data?.data ?? []
  const isEmpty = !isLoading && chartData.length === 0

  return (
    <WidgetWrapper
      id="3"
      title="Нагрузка библиотеки"
      subtitle="Выдачи и возвраты за 7 дней"
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="Нет операций за период"
      isEditing={isEditing}
      isDragging={isDragging}
      isResizing={isResizing}
      headerContent={<FullScreenButton widgetId="3" />}
    >
      <ChartBox className={styles.container}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorReturned" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34C759" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(0,0,0,0.05)"
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#8e8e93' }}
            tickFormatter={str =>
              new Date(str).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
              })
            }
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#8e8e93' }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            }}
          />
          <Area
            type="monotone"
            dataKey="issued"
            name="Выдано"
            stroke="#007AFF"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorIssued)"
          />
          <Area
            type="monotone"
            dataKey="returned"
            name="Возвращено"
            stroke="#34C759"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorReturned)"
          />
        </AreaChart>
      </ChartBox>
    </WidgetWrapper>
  )
}
