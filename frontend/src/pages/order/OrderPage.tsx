import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  Card,
  Steps,
  Typography,
  Tag,
  Button,
  Result,
  Spin,
  Divider,
  Alert,
  Popconfirm,
} from 'antd'
import { SafetyCertificateOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import { useOrder } from '@entities/order/hooks'
import styles from './OrderPage.module.scss'
import { ORDER_STEPS, STATUS_CONFIG } from '@entities/order/consts/statusConfig'

const { Title, Text } = Typography

export const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const {
    order,
    isLoading,
    isError,
    confirmReceipt,
    isConfirming,
    cancelOrder,
    isCancelling,
  } = useOrder(id)

  const currentStatus = useMemo(
    () => (order ? STATUS_CONFIG[order.status] : null),
    [order?.status],
  )

  if (isLoading) return <Spin size="large" className={styles.loader} />
  if (isError || !order) return <Result status="404" title="Заказ не найден" />

  const isCancelled = order.status === 'CANCELLED'

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Title level={2} style={{ margin: 0 }}>
          Заказ #{order.id.slice(0, 8)}
        </Title>

        {order.status === 'PENDING' && (
          <Popconfirm
            title="Отменить заказ?"
            description="Вы уверены, что хотите отменить заявку?"
            // Обернули в стрелку, чтобы не передавать Event в mutate
            onConfirm={() => cancelOrder()}
            okText="Да, отменить"
            cancelText="Нет"
            okButtonProps={{ danger: true }}
          >
            <Button danger loading={isCancelling}>
              Отменить заказ
            </Button>
          </Popconfirm>
        )}
      </header>

      <Card className={styles.orderCard}>
        {!isCancelled && (
          <div className={styles.stepsWrapper}>
            <Steps current={currentStatus?.step} items={ORDER_STEPS} />
          </div>
        )}

        <Divider />

        <main className={styles.statusContent}>
          {isCancelled && (
            <Result
              status="error"
              title="Заказ отменен"
              subTitle="Этот заказ больше не действителен."
            />
          )}

          {order.status === 'PENDING' && (
            <Result
              status="info"
              title="Ожидайте подтверждения"
              subTitle="Библиотекарь проверяет книги. Страница обновится автоматически."
            />
          )}

          {order.status === 'APPROVED' && order.pickupCode && (
            <div className={styles.pickupSection}>
              <Text type="secondary">Ваш секретный код получения:</Text>
              <div className={styles.pickupCode}>{order.pickupCode}</div>
              <Alert
                message="Покажите этот код библиотекарю в зале выдачи"
                type="info"
                showIcon
              />
            </div>
          )}

          {order.status === 'READY_TO_PICKUP' && (
            <Result
              icon={
                <SafetyCertificateOutlined className={styles.successIcon} />
              }
              title="Книги готовы к передаче"
              subTitle="Нажмите кнопку ниже, когда физически получите книги в руки."
              extra={
                <Button
                  type="primary"
                  size="large"
                  loading={isConfirming}
                  // Обернули в стрелку, чтобы TS не ругался на MouseEvent
                  onClick={() => confirmReceipt()}
                >
                  Я получил книги
                </Button>
              }
            />
          )}

          {order.status === 'ON_HAND' && (
            <Result
              status="success"
              title="Книги у вас!"
              subTitle="Желаем приятного и полезного чтения."
            />
          )}
        </main>

        <Divider />

        <footer className={styles.infoGrid}>
          <div className={styles.infoBlock}>
            <Text type="secondary">Оформлен </Text>
            <Text strong>
              {dayjs(order.orderDate).format('DD MMMM YYYY, HH:mm')}
            </Text>
          </div>

          {order.status === 'ON_HAND' && order.dueDate && (
            <div className={styles.infoBlock}>
              <Text type="secondary">Вернуть до </Text>
              <Text strong type="danger">
                {dayjs(order.dueDate).format('DD MMMM YYYY')}
              </Text>
            </div>
          )}

          <div className={styles.infoBlock}>
            <Text type="secondary">Текущий статус </Text>
            <Tag color={currentStatus?.color || 'default'}>
              {currentStatus?.label || order.status}
            </Tag>
          </div>
        </footer>
      </Card>
    </div>
  )
}
