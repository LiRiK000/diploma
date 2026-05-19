import React, { useMemo } from 'react'
import { List, Tag, Typography, Space } from 'antd'
import dayjs from 'dayjs'

const { Text } = Typography

interface OrderItem {
  id: string
  name: string
  value: string
  date: string
}

interface RecentOrdersProps {
  data: OrderItem[]
  limit: number
}

export const RecentOrders: React.FC<RecentOrdersProps> = React.memo(
  ({ data = [], limit }) => {
    const displayedOrders = useMemo(() => data.slice(0, limit), [data, limit])

    const getStatusConfig = (status: string) => {
      switch (status?.toUpperCase()) {
        case 'APPROVED':
          return { color: 'green', text: 'Одобрен' }
        case 'PENDING':
          return { color: 'gold', text: 'Ожидает' }
        case 'REJECTED':
        case 'CANCELLED':
          return { color: 'red', text: 'Отклонен' }
        default:
          return { color: 'blue', text: status }
      }
    }

    return (
      <List
        size="small"
        dataSource={displayedOrders}
        renderItem={(item: OrderItem) => {
          const statusConfig = getStatusConfig(item.value)

          return (
            <List.Item
              style={{
                padding: '8px 4px',
                borderBottom: '1px solid var(--glass-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                  fontSize: '12px',
                }}
              >
                <Space direction="vertical" size={0}>
                  <Text strong className="widget-text-primary">
                    {item.name}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: '11px' }}
                    className="widget-text-secondary"
                  >
                    Создан запрос книги
                  </Text>
                </Space>

                <Space direction="vertical" align="end" size={2}>
                  <Tag
                    color={statusConfig.color}
                    style={{
                      margin: 0,
                      fontSize: '10px',
                      borderRadius: '4px',
                      lineHeight: '16px',
                    }}
                  >
                    {statusConfig.text}
                  </Tag>
                  <Text
                    type="secondary"
                    style={{ fontSize: '10px' }}
                    className="widget-text-secondary"
                  >
                    {dayjs(item.date).format('HH:mm')}
                  </Text>
                </Space>
              </div>
            </List.Item>
          )
        }}
      />
    )
  },
)

RecentOrders.displayName = 'RecentOrders'
