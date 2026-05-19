import React, { useState, useMemo } from 'react'
import { Empty, DatePicker, Select, Space } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import { useWidgetData } from '@entities/widget/hooks/useWidgetData'

import { LibrarianKpi } from '@entities/widget/components/LibrarianKpi/LibrarianKpi'
import { OverdueTrend } from '@entities/widget/components/OverdueTrend/OverdueTrend'
import { TopGenres } from '@entities/widget/components/TopGenres/TopGenres'
import { RecentOrders } from '@entities/widget/components/RecentOrders/RecentOrders'

import {
  AVAILABLE_WIDGETS,
  WidgetRenderType,
} from '@features/addWidget/model/availableWidgets'

import { WidgetWrapper } from '../WidgetWrapper/WidgetWrapper'

const { RangePicker } = DatePicker

interface WidgetLoaderProps {
  id: string
  type: string
  title: string
  isEditing: boolean
  settings?: {
    renderType?: WidgetRenderType
    limit?: number
    range?: string
    [key: string]: any
  }
  isFullscreen: boolean
  onFullscreenChange: (isFullscreen: boolean) => void
  onSettingsClick?: (id: string) => void
  onDeleteClick?: (id: string) => void
}

const getSafeRenderType = (
  widgetType: string,
  renderType?: WidgetRenderType,
): WidgetRenderType => {
  const widgetMeta = AVAILABLE_WIDGETS.find(w => w.type === widgetType)

  if (!widgetMeta) return 'bar'

  const supportedTypes = widgetMeta.supportedRenderTypes.map(t => t.type)

  // SAFE FALLBACK ДЛЯ СТАРОЙ БД
  if (!renderType || !supportedTypes.includes(renderType)) {
    return supportedTypes[0]
  }

  return renderType
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

    const renderType = useMemo(
      () => getSafeRenderType(type, settings?.renderType),
      [type, settings?.renderType],
    )

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

      return {
        range: rangeType,
      }
    }, [rangeType, customDates])

    const { data, isLoading, error } = useWidgetData(id, widgetQuery)

    const renderContent = () => {
      if (!data && !isLoading) {
        return (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Нет данных для отображения"
          />
        )
      }

      switch (type) {
        case 'librarian_kpi':
          return <LibrarianKpi data={data} renderType={renderType} />

        case 'overdue_trend':
          return <OverdueTrend data={data} renderType={renderType} />

        case 'top_genres':
          return <TopGenres data={data} renderType={renderType} />

        case 'recent_orders':
          return <RecentOrders data={data} limit={settings?.limit || 5} />

        default:
          return (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={`Виджет "${type}" не поддерживается`}
            />
          )
      }
    }

    const dateControls = (
      <Space
        size={6}
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      >
        <Select
          size="small"
          value={rangeType}
          onChange={value => setRangeType(value)}
          style={{ width: 120 }}
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
            style={{ width: 240 }}
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
          error ? (error as any)?.message || 'Ошибка загрузки аналитики' : null
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
