import { FC } from 'react'
import { Space } from 'antd'
import { FullScreenButton } from '@entities/widgets-grid'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import { BarChart } from '@shared/components/BarChart'
import styles from './TopGenresWidget.module.scss'
import { useFetchData } from './hooks/useFetchData'

export const TOP_GENRES_WIDGET_ID = '4' as const

interface TopGenresWidgetProps {
  isEditing?: boolean
  isDragging?: boolean
  isResizing?: boolean
}

export const TopGenresWidget: FC<TopGenresWidgetProps> = ({
  isEditing,
  isDragging,
  isResizing,
}) => {
  const { data, isLoading } = useFetchData()

  return (
    <WidgetWrapper
      id={TOP_GENRES_WIDGET_ID}
      title="Топ жанров (месяц)"
      isLoading={isLoading}
      isEmpty={!data?.length}
      emptyMessage="Нет данных"
      isEditing={isEditing}
      isDragging={isDragging}
      isResizing={isResizing}
      headerContent={
        <Space>
          <FullScreenButton widgetId={TOP_GENRES_WIDGET_ID} />
        </Space>
      }
      contentClass={styles.chart}
    >
      <BarChart data={data ?? []} fill="#0088FE" />
    </WidgetWrapper>
  )
}
