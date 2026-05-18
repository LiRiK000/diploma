import type { WidgetGridProps } from '@entities/widgets-grid/types'
import { getRangeSubtitle } from '@entities/statistic/lib/statsQuery'
import { WidgetRangePicker } from '../components/WidgetRangePicker/WidgetRangePicker'
import { FullScreenButton } from '@entities/widgets-grid'
import { Space } from 'antd'

/** Заголовок виджета: период + полноэкранный режим */
export function buildWidgetHeaderExtras(
  widgetId: string,
  props: Pick<WidgetGridProps, 'rangeConfig' | 'onRangeChange' | 'isEditing'>,
  options?: { allowToday?: boolean },
) {
  const { rangeConfig, onRangeChange, isEditing } = props
  if (!rangeConfig) {
    return <FullScreenButton widgetId={widgetId} />
  }

  return (
    <Space size={8} wrap>
      {onRangeChange ? (
        <WidgetRangePicker
          value={rangeConfig}
          onChange={onRangeChange}
          compact
          allowToday={options?.allowToday}
        />
      ) : null}
      <FullScreenButton widgetId={widgetId} />
    </Space>
  )
}

export function getWidgetRangeSubtitle(
  props: Pick<WidgetGridProps, 'rangeConfig'>,
  fallback: string,
) {
  return props.rangeConfig
    ? getRangeSubtitle(props.rangeConfig)
    : fallback
}
