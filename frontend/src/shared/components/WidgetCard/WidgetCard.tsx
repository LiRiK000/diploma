// widgets/WidgetCard/WidgetCard.tsx
import { FC, ReactNode } from 'react'
import { Card, Spin, Empty } from 'antd'
import { HolderOutlined } from '@ant-design/icons'

import './WidgetCard.css'

interface WidgetCardProps {
  title?: string
  extra?: ReactNode
  beforeTitle?: ReactNode
  children: ReactNode
  isLoading?: boolean
  isEmpty?: boolean
  emptyDescription?: string
  className?: string
  bodyStyle?: React.CSSProperties
  headStyle?: React.CSSProperties
  isDragging?: boolean
  isResizing?: boolean
  isEditable?: boolean
}

export const WidgetCard: FC<WidgetCardProps> = ({
  title,
  extra,
  beforeTitle,
  children,
  isLoading = false,
  isEmpty = false,
  emptyDescription = 'Нет данных для отображения',
  className = '',
  bodyStyle,
  headStyle,
  isDragging = false,
  isResizing = false,
  isEditable = false,
}) => {
  const cardClass = [
    'dashboard-widget-card',
    isDragging ? 'dragging' : '',
    isResizing ? 'resizing' : '',
    isEditable ? 'editable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const cardTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {isEditable && (
        <HolderOutlined
          style={{ fontSize: 18, color: '#888', cursor: 'grab' }}
        />
      )}
      {beforeTitle}
      <span>{title}</span>
    </div>
  )

  return (
    <Card
      title={title ? cardTitle : null}
      extra={extra}
      className={cardClass}
      bodyStyle={{
        height: '100%',
        padding: isLoading || isEmpty ? 0 : undefined,
        display: 'flex',
        flexDirection: 'column',
        ...bodyStyle,
      }}
      headStyle={{
        padding: '0 16px',
        background: 'rgba(0,0,0,0.02)',
        borderBottom: '1px solid #f0f0f0',
        ...headStyle,
      }}
      bordered
      hoverable={!isDragging && !isResizing}
    >
      {isLoading ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spin size="large" />
        </div>
      ) : isEmpty ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Empty
            description={emptyDescription}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        children
      )}
    </Card>
  )
}
