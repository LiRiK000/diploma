import React from 'react'
import { List, Typography, Image, Tag, Space } from 'antd'
import { BookOpen, Calendar, Clock } from 'lucide-react'
import dayjs from 'dayjs'
import { OrderResponse, OrderItem } from '../../types'
import classes from '../../OrderDetails.module.scss'

const { Text } = Typography

interface OrderInfoProps {
  order: OrderResponse
}

export const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <Space size={8}>
          <BookOpen size={18} className={classes.headerIcon} />
          <span className={classes.cardTitle}>Список книг в заказе</span>
        </Space>
        <span className={classes.itemsCount}>
          {order.items?.length || 0} книги
        </span>
      </div>

      <div className={classes.cardBody}>
        <List<OrderItem>
          itemLayout="horizontal"
          dataSource={order.items}
          rowKey={item => item.id}
          renderItem={item => (
            <List.Item className={classes.bookItem}>
              <List.Item.Meta
                avatar={
                  <div className={classes.coverWrapper}>
                    <Image
                      src={item.book?.coverUrl}
                      width={64}
                      height={96}
                      className={classes.bookCover}
                      fallback="https://placehold.co/64x96?text=No+Cover"
                      preview={{
                        mask: (
                          <span className={classes.previewMask}>Открыть</span>
                        ),
                      }}
                    />
                  </div>
                }
                title={
                  <span className={classes.bookTitleText}>
                    {item.book?.title}
                  </span>
                }
                description={
                  <Space direction="vertical" size={4} style={{ marginTop: 4 }}>
                    <Text className={classes.bookAuthorText}>
                      {item.book?.author?.firstName || ''}{' '}
                      {item.book?.author?.lastName ||
                        `ID Автора: ${item.book?.authorId}`}
                    </Text>
                    <div className={classes.qtyBadgeContainer}>
                      <span className={classes.qtyLabel}>Запрошено:</span>
                      <span className={classes.qtyBadge}>
                        {item.quantity} шт.
                      </span>
                    </div>
                  </Space>
                }
              />
              <Tag
                color={item.book?.availableQuantity > 0 ? 'success' : 'warning'}
                className={classes.warehouseTag}
              >
                На складе: {item.book?.availableQuantity ?? 0} шт.
              </Tag>
            </List.Item>
          )}
        />

        <div className={classes.orderFooter}>
          <div className={classes.footerTimelineItem}>
            <Calendar size={14} />
            <span>
              Создан: <b>{dayjs(order.createdAt).format('DD.MM.YYYY')}</b>
            </span>
          </div>
          <div className={`${classes.footerTimelineItem} ${classes.danger}`}>
            <Clock size={14} />
            <span>
              Вернуть до: <b>{dayjs(order.dueDate).format('DD.MM.YYYY')}</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
