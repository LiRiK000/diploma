import { List, Card, Tag, Typography, Button, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@shared/services/Order'
import { OrderResponse } from '@shared/services/Order/types'
import { Loader } from '@shared/components/Loader'
import styles from './OrderList.module.scss'

const { Title, Text } = Typography

// Маппинг цветов для статусов
const statusColors: Record<string, string> = {
  PENDING: 'orange',
  APPROVED: 'blue',
  READY_TO_PICKUP: 'cyan',
  ON_HAND: 'green',
  CANCELLED: 'red',
}

export const OrderList = () => {
  const navigate = useNavigate()

  const { data: orders, isLoading } = useQuery<OrderResponse[]>({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders(),
  })

  if (isLoading) return <Loader />

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>
        Мои заказы
      </Title>

      <List
        dataSource={orders}
        renderItem={order => (
          <Card
            className={styles.orderCard}
            onClick={() => navigate(`/order/${order.id}`)}
            hoverable
          >
            <div className={styles.cardHeader}>
              <Space direction="vertical">
                <Text strong>Заказ #{order.id.slice(0, 8)}</Text>
                <Text type="secondary">
                  от {dayjs(order.orderDate).format('DD.MM.YYYY')}
                </Text>
              </Space>

              <Tag
                color={statusColors[order.status]}
                style={{ borderRadius: '12px' }}
              >
                {order.status}
              </Tag>
            </div>

            <div className={styles.bookPreview}>
              {order.items.map(item => (
                <div key={item.id} title={item.book.title}>
                  <img src={item.book.coverUrl} alt={item.book.title} />
                </div>
              ))}
              {order.items.length > 5 && (
                <div style={{ alignSelf: 'center' }}>
                  <Text type="secondary">+{order.items.length - 5}</Text>
                </div>
              )}
            </div>

            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button
                type="link"
                onClick={() => navigate(`/order/${order.id}`)}
              >
                Подробнее →
              </Button>
            </div>
          </Card>
        )}
      />
    </div>
  )
}
