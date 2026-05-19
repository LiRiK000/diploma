import React, { useState, useMemo } from 'react'
import { Empty, DatePicker, Select, Space } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useWidgetData } from '@entities/widget/hooks/useWidgetData'
import { LibrarianKpi } from '@entities/widget/components/LibrarianKpi/LibrarianKpi'
import { OverdueTrend } from '@entities/widget/components/OverdueTrend/OverdueTrend'
import { TopGenres } from '@entities/widget/components/TopGenres/TopGenres'
import { RecentOrders } from '@entities/widget/components/RecentOrders/RecentOrders'
import { WidgetWrapper } from '../WidgetWrapper/WidgetWrapper'

const { RangePicker } = DatePicker

interface WidgetLoaderProps {
  id: string
  type: string
  title: string
  isEditing: boolean
  settings?: {
    limit?: number
    range?: string
    [key: string]: any
  }
  isFullscreen: boolean
  onFullscreenChange: (isFullscreen: boolean) => void
  onSettingsClick?: (id: string) => void
  onDeleteClick?: (id: string) => void
}

export const WidgetLoader: React.FC<WidgetLoaderProps> = React.memo(
  ({
    id,
    type,
    title,
    isEditing,
    settings,
    isFullscreen,
    onFullscreenChange,
    onSettingsClick,
    onDeleteClick,
  }) => {
    const [rangeType, setRangeType] = useState<string>(
      settings?.range || 'MONTH',
    )

    const [customDates, setCustomDates] = useState<
      [Dayjs | null, Dayjs | null] | null
    >(null)

    const widgetQuery = useMemo(() => {
      if (
        rangeType === 'CUSTOM' &&
        customDates &&
        customDates[0] &&
        customDates[1]
      ) {
        return {
          from: customDates[0].startOf('day').toISOString(),
          to: customDates[1].endOf('day').toISOString(),
        }
      }
      return { range: rangeType }
    }, [rangeType, customDates])

    const { data, isLoading, error } = useWidgetData(id, widgetQuery)

    const renderContent = () => {
      if (!data && !isLoading) {
        return (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Данные отсутствуют"
          />
        )
      }

      switch (type) {
        case 'librarian_kpi':
          return <LibrarianKpi data={data} />
        case 'overdue_trend':
          return <OverdueTrend data={data} />
        case 'top_genres':
          return <TopGenres data={data} />
        case 'recent_orders':
          return <RecentOrders data={data} limit={settings?.limit || 4} />
        default:
          return (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={`Тип виджета "${type}" не поддерживается`}
            />
          )
      }
    }

    const dateControls = (
      <Space
        size={4}
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      >
        <Select
          size="small"
          value={rangeType}
          onChange={value => setRangeType(value)}
          style={{ width: 105, fontSize: '12px' }}
          options={[
            { value: 'TODAY', label: 'Сегодня' },
            { value: 'WEEK', label: 'Неделя' },
            { value: 'MONTH', label: 'Месяц' },
            { value: 'YEAR', label: 'Год' },
            { value: 'CUSTOM', label: 'Период...' },
          ]}
        />
        {rangeType === 'CUSTOM' && (
          <RangePicker
            size="small"
            style={{ width: 210 }}
            value={customDates}
            onChange={dates => setCustomDates(dates)}
            allowClear={false}
          />
        )}
      </Space>
    )

    return (
      <WidgetWrapper
        title={title}
        isEditing={isEditing}
        isLoading={isLoading}
        error={
          error ? (error as any).message || 'Ошибка загрузки аналитики' : null
        }
        isFullscreen={isFullscreen}
        onFullscreenChange={onFullscreenChange}
        onSettingsClick={
          onSettingsClick ? () => onSettingsClick(id) : undefined
        }
        onDeleteClick={onDeleteClick ? () => onDeleteClick(id) : undefined}
        extra={dateControls}
      >
        {renderContent()}
      </WidgetWrapper>
    )
  },
)

WidgetLoader.displayName = 'WidgetLoader'
