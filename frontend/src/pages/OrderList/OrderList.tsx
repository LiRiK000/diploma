import { List, Card, Tag, Typography, Button, Space, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { Loader } from '@shared/components/Loader'
import { useOrders } from './hooks/useOrders'
import {
  STATUS_MAP,
  MAX_VISIBLE_COVERS,
  DATE_FORMAT,
} from './OrderList.constants'
import styles from './OrderList.module.scss'

const { Title, Text } = Typography

export const OrderList = () => {
  const navigate = useNavigate()
  const { orders, isLoading, isEmpty } = useOrders()
  console.log('orders', orders)
  if (isLoading) return <Loader />

  if (isEmpty) {
    return (
      <div className={styles.empty}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">
              Здесь пока пусто. Время найти что-то интересное!
            </Text>
          }
        >
          <Button
            type="primary"
            shape="round"
            size="large"
            onClick={() => navigate('/catalog')}
          >
            Перейти в каталог
          </Button>
        </Empty>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Title level={2}>Мои заказы</Title>
        <Text type="secondary">
          История ваших чтений и активные бронирования
        </Text>
      </header>

      <List
        dataSource={orders}
        split={false}
        renderItem={order => {
          const status = STATUS_MAP[order.status] || {
            color: 'default',
            label: order.status,
          }
          const extraItems = order.items.length - MAX_VISIBLE_COVERS

          return (
            <List.Item className={styles.listItem}>
              <Card
                className={styles.orderCard}
                bordered={false}
                onClick={() => navigate(`/order/${order.id}`)}
              >
                <div className={styles.cardContent}>
                  <div className={styles.mainInfo}>
                    <Space direction="vertical" size={4}>
                      <div className={styles.orderIdBlock}>
                        <Text className={styles.hash}>#</Text>
                        <Text strong className={styles.idText}>
                          {order.id.slice(-6).toUpperCase()}
                        </Text>
                      </div>
                      <Text className={styles.dateText}>
                        {dayjs(order.orderDate).format(DATE_FORMAT)}
                      </Text>
                    </Space>

                    <Tag color={status.color} className={styles.statusTag}>
                      {status.label.toUpperCase()}
                    </Tag>
                  </div>

                  <div className={styles.visualSide}>
                    <div className={styles.bookStack}>
                      {order.items
                        .slice(0, MAX_VISIBLE_COVERS)
                        .map((item, idx) => (
                          <div
                            key={item.id}
                            className={styles.stackedCover}
                            style={{
                              zIndex: 10 - idx,
                              transform: `translateX(-${idx * 20}px)`,
                            }}
                          >
                            <img
                              src={item.book.coverImage}
                              alt={item.book.title}
                            />
                          </div>
                        ))}
                      {extraItems > 0 && (
                        <div className={styles.glassCounter}>
                          <Text>+{extraItems}</Text>
                        </div>
                      )}
                    </div>
                    <div className={styles.arrowIcon}>
                      <Button type="text" icon={<span>→</span>} />
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          )
        }}
      />
    </div>
  )
}
