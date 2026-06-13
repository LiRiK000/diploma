import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  Card,
  Steps,
  Typography,
  Tag,
  Button,
  Result,
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
import { motion, AnimatePresence } from 'framer-motion'

import { useOrder } from '@entities/order/hooks'
import styles from './OrderPage.module.scss'
import {
  ORDER_STEPS,
  STATUS_CONFIG,
  OrderStatus,
} from '@entities/order/consts/statusConfig'
import { Loader } from '@shared/components/Loader'

const { Title, Text } = Typography

// Константы для анимаций, чтобы не пересоздавать их при каждом рендере (оптимизация)
const faderVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
}

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

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

  if (isLoading) return <Loader />
  if (isError || !order) return <Result status="404" title="Заказ не найден" />

  const status = order.status as OrderStatus
  const isCancelled = status === 'CANCELLED'
  const isReturned = status === 'RETURNED'
  const isOverdue = status === 'OVERDUE'
  const isOnHand = status === 'ON_HAND' || isOverdue

  const returnCode = order.id.slice(0, 8).toUpperCase()

  return (
    // motion.div на контейнере плавно запускает появление всей страницы
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.header className={styles.header} variants={faderVariants}>
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
      </motion.header>

      <motion.div variants={faderVariants} style={{ width: '100%' }}>
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

          {/* mode="wait" гарантирует, что старый статус сначала исчезнет, а затем появится новый */}
          <main className={styles.statusContent}>
            <AnimatePresence mode="wait">
              {isCancelled && (
                <motion.div
                  key="cancelled"
                  variants={faderVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Result
                    status="error"
                    title="Заказ отменен"
                    subTitle="Этот заказ больше не действителен."
                  />
                </motion.div>
              )}

              {status === 'PENDING' && (
                <motion.div
                  key="pending"
                  variants={faderVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Result
                    icon={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                    title="Заявка на рассмотрении"
                    subTitle="Библиотекарь проверяет наличие книг. Мы уведомим вас о готовности."
                  />
                </motion.div>
              )}

              {status === 'APPROVED' && order.pickupCode && (
                <motion.div
                  key="approved"
                  className={styles.pickupSection}
                  variants={faderVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Text className={styles.instructionText}>
                    Ваш секретный код получения:
                  </Text>
                  <div className={styles.pickupCode}>{order.pickupCode}</div>
                  <Alert
                    message="Покажите этот код библиотекарю для получения книг"
                    type="info"
                    showIcon
                  />
                </motion.div>
              )}

              {status === 'READY_TO_PICKUP' && (
                <motion.div
                  key="ready"
                  variants={faderVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Result
                    icon={
                      <SafetyCertificateOutlined
                        className={styles.successIcon}
                      />
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
                </motion.div>
              )}

              {isOnHand && (
                <motion.div
                  key="on_hand"
                  className={styles.pickupSection}
                  variants={faderVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
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
                  <div
                    className={`${styles.pickupCode} ${styles.returnVariant}`}
                  >
                    {returnCode}
                  </div>
                  {isOverdue && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Alert
                        message="Внимание: за просрочку может быть начислен штраф согласно правилам библиотеки."
                        type="error"
                        showIcon
                        style={{ marginTop: 16 }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {isReturned && (
                <motion.div
                  key="returned"
                  variants={faderVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Result
                    icon={
                      <CheckCircleOutlined className={styles.successIcon} />
                    }
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
                </motion.div>
              )}
            </AnimatePresence>
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
              {/* Анимируем тег статуса при его изменении */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'inline-block' }}
                >
                  <Tag
                    color={currentStatus?.color || 'default'}
                    className={styles.statusTag}
                  >
                    {(currentStatus?.label || status).toUpperCase()}
                  </Tag>
                </motion.div>
              </AnimatePresence>
            </div>
          </footer>
        </Card>
      </motion.div>
    </motion.div>
  )
}
