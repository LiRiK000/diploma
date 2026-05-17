import { FC } from 'react'
import { Space } from 'antd'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import { FullScreenButton } from '@entities/widgets-grid'
import { ChartRenderer } from '@features/widget-builder/ui/ChartRenderer/ChartRenderer'
import { getSourceLabel } from '@features/widget-builder/config/widgetOptions'
import { useDynamicWidgetChart } from '../hooks/useDynamicWidgetChart'
import { DynamicWidgetProps } from './types'
import styles from './DynamicWidget.module.scss'

export const DynamicWidget: FC<DynamicWidgetProps> = ({
  id,
  config,
  isEditing,
  isDragging,
  isResizing,
  onRemove,
}) => {
  const { data, isLoading, isEmpty } = useDynamicWidgetChart(config)

  return (
    <WidgetWrapper
      id={id}
      title={config.title}
      subtitle={getSourceLabel(config.source)}
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="Нет данных за выбранный период"
      isEditing={isEditing}
      isDragging={isDragging}
      isResizing={isResizing}
      onRemove={onRemove}
      headerContent={
        <Space>
          <FullScreenButton widgetId={id} />
        </Space>
      }
    >
      <div className={styles.chart}>
        <ChartRenderer type={config.type} data={data} />
      </div>
    </WidgetWrapper>
  )
}
