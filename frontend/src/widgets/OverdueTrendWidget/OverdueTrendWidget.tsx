import { Space } from 'antd'
import { FullScreenButton } from '@entities/widgets-grid'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import { LineChart } from '@shared/components/LineChart'
import styles from './OverdueTrendWidget.module.scss'
import { useFetchData } from './hooks/useFetchData'

export const OVERDUE_TREND_WIDGET_ID = '2' as const

export const OverdueTrendWidget = () => {
  const { data, isLoading } = useFetchData()

  return (
    <WidgetWrapper
      title="Просрочки за неделю"
      isLoading={isLoading}
      isEmpty={!data?.length}
      emptyMessage="Нет данных"
      headerContent={
        <Space>
          <FullScreenButton widgetId={OVERDUE_TREND_WIDGET_ID} />
        </Space>
      }
      contentClass={styles.chart}
    >
      <LineChart data={data ?? []} stroke="#FFBB28" />
    </WidgetWrapper>
  )
}
