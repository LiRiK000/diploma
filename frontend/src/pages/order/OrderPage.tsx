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
  Space,
} from 'antd'
import {
  SafetyCertificateOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
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
        <Space direction="vertical" size={0}>
          <Text type="secondary">Заказ из библиотеки</Text>
          <Title level={2} style={{ margin: 0 }}>
            #{order.id.slice(-8).toUpperCase()}
          </Title>
        </Space>

        {order.status === 'PENDING' && (
          <Popconfirm
            title="Отменить заказ?"
            description="Вы уверены, что хотите отменить заявку?"
            onConfirm={() => cancelOrder()}
            okText="Да, отменить"
            cancelText="Нет"
            okButtonProps={{ danger: true }}
          >
            <Button danger loading={isCancelling} shape="round">
              Отменить заказ
            </Button>
          </Popconfirm>
        )}
      </header>

      <Card className={styles.orderCard} bordered={false}>
        {!isCancelled && (
          <div className={styles.stepsWrapper}>
            <Steps
              current={currentStatus?.step}
              items={ORDER_STEPS}
              size="small"
              responsive={true}
            />
          </div>
        )}

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
              icon={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
              title="Заявка на рассмотрении"
              subTitle="Библиотекарь проверяет наличие книг. Мы уведомим вас о готовности."
            />
          )}

          {order.status === 'APPROVED' && order.pickupCode && (
            <div className={styles.pickupSection}>
              <Text type="secondary">Ваш секретный код получения:</Text>
              <div className={styles.pickupCode}>{order.pickupCode}</div>
              <Alert
                message="Покажите этот код библиотекарю для получения книг"
                type="info"
                showIcon
                style={{ borderRadius: '12px' }}
              />
            </div>
          )}

          {order.status === 'READY_TO_PICKUP' && (
            <Result
              icon={
                <SafetyCertificateOutlined className={styles.successIcon} />
              }
              title="Можно забирать!"
              subTitle="Книги ждут вас на стойке выдачи. Подтвердите получение после того, как возьмете их."
              extra={
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  loading={isConfirming}
                  onClick={() => confirmReceipt()}
                  style={{ padding: '0 40px' }}
                >
                  Я получил книги
                </Button>
              }
            />
          )}

          {order.status === 'ON_HAND' && (
            <Result
              status="success"
              title="Книги у вас"
              subTitle="Приятного чтения! Не забудьте вернуть их в срок."
            />
          )}
        </main>

        <Divider />

        <footer className={styles.infoGrid}>
          <div className={styles.infoBlock}>
            <Text className={styles.label}>Оформлен</Text>
            <Text strong className={styles.value}>
              {dayjs(order.orderDate).format('DD.MM.YYYY, HH:mm')}
            </Text>
          </div>

          <div className={styles.infoBlock}>
            <Text className={styles.label}>Срок возврата</Text>
            {order.status === 'ON_HAND' && order.dueDate ? (
              <Text strong className={`${styles.value} ${styles.danger}`}>
                {dayjs(order.dueDate).format('DD MMMM YYYY')}
              </Text>
            ) : (
              <Text className={styles.value} type="secondary">
                —
              </Text>
            )}
          </div>

          <div className={styles.infoBlock}>
            <Text className={styles.label}>Текущий статус</Text>
            <Tag
              color={currentStatus?.color || 'default'}
              className={styles.statusTag}
            >
              {(currentStatus?.label || order.status).toUpperCase()}
            </Tag>
          </div>
        </footer>
      </Card>
    </div>
  )
}
