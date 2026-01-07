import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import { useFetchData } from './hooks/useFetchData'
import { PieChart } from '@shared/components/PieChart'
import { Space } from 'antd'
import { FullScreenButton } from '@entities/widgets-grid'
import { LIBRARY_WORKLOAD_WIDGET_ID } from './constants'

export const LibraryWorkloadWidget = () => {
  const { data, isLoading } = useFetchData()
  const chartData = [
    { name: 'В наличии', value: data?.booksInStock ?? 0 },
    { name: 'У читателей', value: data?.booksInOrder ?? 0 },
    { name: 'Просрочены', value: data?.booksOverdue ?? 0 },
  ]
  const colors = ['#0088FE', '#00C49F', '#FFBB28']
  const size = 100

  return (
    <WidgetWrapper
      title="Загрузка библиотеки"
      isEmpty={!data}
      emptyMessage="Нет данных"
      isLoading={isLoading}
      headerContent={
        <Space>
          <FullScreenButton widgetId={LIBRARY_WORKLOAD_WIDGET_ID} />
        </Space>
      }
    >
      <PieChart data={chartData} colors={colors} size={size} showLegend />
    </WidgetWrapper>
  )
}
