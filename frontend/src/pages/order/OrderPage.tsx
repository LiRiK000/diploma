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
  CheckCircleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

import { useOrder } from '@entities/order/hooks'
import styles from './OrderPage.module.scss'
import {
  ORDER_STEPS,
  STATUS_CONFIG,
  OrderStatus,
} from '@entities/order/consts/statusConfig'

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

  const status = order.status as OrderStatus
  const isCancelled = status === 'CANCELLED'
  const isReturned = status === 'RETURNED'
  const isOverdue = status === 'OVERDUE'
  const isOnHand = status === 'ON_HAND' || isOverdue

  const returnCode = order.id.slice(0, 8).toUpperCase()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Space direction="vertical" size={0}>
          <Text type="secondary">Заказ из библиотеки</Text>
          <Title level={2} style={{ margin: 0 }}>
            #{order.id.slice(-8).toUpperCase()}
          </Title>
        </Space>

        {status === 'PENDING' && (
          <Popconfirm
            title="Отменить заказ?"
            onConfirm={() => cancelOrder()}
            okText="Да"
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
              responsive
            />
          </div>
        )}

        <main className={styles.statusContent}>
          {/* ОТМЕНЕНО */}
          {isCancelled && (
            <Result
              status="error"
              title="Заказ отменен"
              subTitle="Этот заказ больше не действителен."
            />
          )}

          {/* В ОЖИДАНИИ */}
          {status === 'PENDING' && (
            <Result
              icon={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
              title="Заявка на рассмотрении"
              subTitle="Библиотекарь проверяет наличие книг. Мы уведомим вас о готовности."
            />
          )}

          {/* ОДОБРЕНО (ПОЛУЧЕНИЕ) */}
          {status === 'APPROVED' && order.pickupCode && (
            <div className={styles.pickupSection}>
              <Text className={styles.instructionText}>
                Ваш секретный код получения:
              </Text>
              <div className={styles.pickupCode}>{order.pickupCode}</div>
              <Alert
                message="Покажите этот код библиотекарю для получения книг"
                type="info"
                showIcon
              />
            </div>
          )}

          {/* ГОТОВ К ВЫДАЧЕ */}
          {status === 'READY_TO_PICKUP' && (
            <Result
              icon={
                <SafetyCertificateOutlined className={styles.successIcon} />
              }
              title="Можно забирать!"
              subTitle="Книги ждут вас на стойке выдачи."
              extra={
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  loading={isConfirming}
                  onClick={() => confirmReceipt()}
                >
                  Я получил книги
                </Button>
              }
            />
          )}

          {/* НА РУКАХ / ПРОСРОЧЕНО (ВОЗВРАТ) */}
          {isOnHand && (
            <div className={styles.pickupSection}>
              <Result
                status={isOverdue ? 'warning' : 'success'}
                title={isOverdue ? 'Срок возврата истек' : 'Книги у вас'}
                subTitle={
                  isOverdue
                    ? 'Пожалуйста, верните книги как можно скорее.'
                    : 'Приятного чтения!'
                }
              />
              <Divider dashed>Код для возврата</Divider>
              <Text className={styles.instructionText}>
                Назовите этот номер библиотекарю при возврате:
              </Text>
              <div className={`${styles.pickupCode} ${styles.returnVariant}`}>
                {returnCode}
              </div>
              {isOverdue && (
                <Alert
                  message="Внимание: за просрочку может быть начислен штраф согласно правилам библиотеки."
                  type="error"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )}
            </div>
          )}

          {/* ВОЗВРАЩЕНО */}
          {isReturned && (
            <Result
              icon={<CheckCircleOutlined className={styles.successIcon} />}
              title="Книги возвращены"
              subTitle="Заказ успешно закрыт. Ждем вас снова!"
              extra={
                <Button
                  type="default"
                  shape="round"
                  onClick={() => (window.location.href = '/')}
                >
                  На главную
                </Button>
              }
            />
          )}
        </main>

        <Divider />

        <footer className={styles.infoGrid}>
          <div className={styles.infoBlock}>
            <span className={styles.label}>Оформлен</span>
            <Text strong className={styles.value}>
              {dayjs(order.orderDate).format('DD.MM.YYYY, HH:mm')}
            </Text>
          </div>

          <div className={styles.infoBlock}>
            <span className={styles.label}>Срок возврата</span>
            {order.dueDate ? (
              <Text
                strong
                className={`${styles.value} ${isOverdue ? styles.danger : ''}`}
              >
                {dayjs(order.dueDate).format('DD MMMM YYYY')}
              </Text>
            ) : (
              <Text className={styles.value} type="secondary">
                —
              </Text>
            )}
          </div>

          <div className={styles.infoBlock}>
            <span className={styles.label}>Текущий статус</span>
            <Tag
              color={currentStatus?.color || 'default'}
              className={styles.statusTag}
            >
              {(currentStatus?.label || status).toUpperCase()}
            </Tag>
          </div>
        </footer>
      </Card>
    </div>
  )
}
