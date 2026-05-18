import { FC, useMemo } from 'react'
import type { WidgetGridProps } from '@entities/widgets-grid/types'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import { ChartRenderer } from '@features/widget-builder/ui/ChartRenderer/ChartRenderer'
import { getSourceLabel } from '@features/widget-builder/config/widgetOptions'
import {
  useDynamicWidgetChart,
  widgetConfigToRange,
} from '../hooks/useDynamicWidgetChart'
import type { DynamicWidgetProps } from '../model/types'
import {
  buildWidgetHeaderExtras,
  getWidgetRangeSubtitle,
} from '../model/widgetRangeProps'
import styles from './DynamicWidget.module.scss'

export const DynamicWidget: FC<DynamicWidgetProps & WidgetGridProps> = ({
  id,
  config,
  isEditing,
  isDragging,
  isResizing,
  onRemove,
  rangeConfig,
  onRangeChange,
}) => {
  const { data, isLoading, isEmpty } = useDynamicWidgetChart(config)
  const range = rangeConfig ?? widgetConfigToRange(config)

  const headerProps = useMemo(
    () => ({
      rangeConfig: range,
      onRangeChange,
      isEditing,
    }),
    [range, onRangeChange, isEditing],
  )

  return (
    <WidgetWrapper
      id={id}
      title={config.title}
      subtitle={`${getSourceLabel(config.source)} · ${getWidgetRangeSubtitle({ rangeConfig: range }, '')}`}
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="Нет данных за выбранный период"
      isEditing={isEditing}
      isDragging={isDragging}
      isResizing={isResizing}
      onRemove={onRemove}
      headerContent={buildWidgetHeaderExtras(id, headerProps, {
        allowToday: false,
      })}
    >
      <div className={styles.chart}>
        <ChartRenderer type={config.type} data={data} />
      </div>
    </WidgetWrapper>
  )
}
