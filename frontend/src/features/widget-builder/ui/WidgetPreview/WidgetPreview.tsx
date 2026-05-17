import { Skeleton } from 'antd'
import type { WidgetConfig } from '../../model/useWidgetBuilderStore'
import { useDynamicWidgetChart } from '@widgets/LibrarianDashboardTab/hooks/useDynamicWidgetChart'
import { ChartRenderer } from '../ChartRenderer/ChartRenderer'

export const PreviewChart = ({ config }: { config: WidgetConfig }) => {
  const { data, isLoading } = useDynamicWidgetChart(config)

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 4 }} title={false} />
  }

  return <ChartRenderer type={config.type} data={data} compact />
}
