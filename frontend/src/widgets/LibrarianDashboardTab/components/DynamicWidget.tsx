import { FC } from 'react'
import { Space } from 'antd'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import { FullScreenButton } from '@entities/widgets-grid'
import { PreviewChart } from '@features/widget-builder/ui/WidgetPreview/WidgetPreview'
import { DynamicWidgetProps } from './types'

export const DynamicWidget: FC<DynamicWidgetProps> = ({
  id,
  config,
  ...props
}) => {
  return (
    <WidgetWrapper
      id={id}
      title={config.title}
      headerContent={
        <Space>
          <FullScreenButton widgetId={id} />
        </Space>
      }
      {...props}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          padding: '8px',
        }}
      >
        <PreviewChart type={config.type} />
      </div>
    </WidgetWrapper>
  )
}
