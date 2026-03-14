import { Space } from 'antd'
import { FullScreenButton } from '@entities/widgets-grid'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import { BarChart } from '@shared/components/BarChart'
import styles from './TopGenresWidget.module.scss'
import { useFetchData } from './hooks/useFetchData'

export const TOP_GENRES_WIDGET_ID = '4' as const

export const TopGenresWidget = () => {
  const { data, isLoading } = useFetchData()

  return (
    <WidgetWrapper
      title="Топ жанров (месяц)"
      isLoading={isLoading}
      isEmpty={!data?.length}
      emptyMessage="Нет данных"
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
