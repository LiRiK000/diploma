import React from 'react'
import { Card, List, Typography, Image, Tag, Space } from 'antd'
import { BookOpen, Calendar } from 'lucide-react'
import dayjs from 'dayjs'
import { OrderResponse, OrderItem } from '../../types'
import classes from '../../OrderDetails.module.scss'

const { Text } = Typography

interface OrderInfoProps {
  order: OrderResponse
}

export const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
  return (
    <Card
      title={
        <Space>
          <BookOpen size={18} /> Список книг в заказе
        </Space>
      }
    >
      <List<OrderItem>
        itemLayout="horizontal"
        dataSource={order.items}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Image
                  src={item.book.coverUrl}
                  width={60}
                  fallback="https://placehold.co/60x90?text=No+Cover"
                />
              }
              title={<Text strong>{item.book.title}</Text>}
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary">
                    {item.book.author?.name ||
                      `ID Автора: ${item.book.authorId}`}
                  </Text>
                  <Text style={{ fontSize: '12px' }}>
                    Кол-во: {item.quantity} шт.
                  </Text>
                </Space>
              }
            />
            <Tag color={item.book.availableQuantity > 0 ? 'green' : 'orange'}>
              На складе: {item.book.availableQuantity}
            </Tag>
          </List.Item>
        )}
      />

      <div className={classes.orderFooter} style={{ marginTop: 20 }}>
        <Space size="large">
          <Text type="secondary">
            Создан: {dayjs(order.createdAt).format('DD.MM.YYYY')}
          </Text>
          <Text type="danger">
            Вернуть до: {dayjs(order.dueDate).format('DD.MM.YYYY')}
          </Text>
        </Space>
      </div>
    </Card>
  )
}
