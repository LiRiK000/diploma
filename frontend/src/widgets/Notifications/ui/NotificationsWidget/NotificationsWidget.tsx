import { useState, useMemo } from 'react'
import { Tabs, Button, Space, Typography, Empty, Skeleton } from 'antd'
import {
  DeleteOutlined,
  CheckCircleOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'

import { NotificationItem } from '@entities/notifications/ui/NotificationItem/NotificationItem'
import { useNotifications } from '@entities/notifications/hooks/useNotifications'

import styles from './NotificationsWidget.module.scss'

const { Title, Text } = Typography

export const NotificationsWidget = () => {
  const [activeTab, setActiveTab] = useState('all')

  const {
    notifications,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    markAllRead,
    markRead,
    unreadCount,
    isMarkingAllLoading,
  } = useNotifications({ take: 15 })
  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications

    return notifications.filter(n => {
      const type = n.type.toUpperCase()

      if (activeTab === 'orders') {
        return type === 'ORDER_STATUS' || type === 'OVERDUE'
      }
      if (activeTab === 'achievements') {
        return type === 'ACHIEVEMENT' || type === 'SYSTEM'
      }
      return false
    })
  }, [activeTab, notifications])

  console.log('Непрочитанные уведомления:', unreadCount)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={2} className={styles.mainTitle}>
            Уведомления
            {unreadCount > 0 && (
              <span className={styles.countBadge}>{unreadCount}</span>
            )}
          </Title>
          <Text type="secondary">
            Ваша лента активности и системные сообщения
          </Text>
        </div>
        <Space>
          <Button
            type="text"
            className={styles.actionBtn}
            icon={<CheckCircleOutlined />}
            onClick={() => markAllRead()}
            loading={isMarkingAllLoading}
            disabled={isLoading || unreadCount === 0}
          >
            Прочитать все
          </Button>
          <Button
            type="text"
            danger
            className={styles.actionBtn}
            icon={<DeleteOutlined />}
            onClick={() => {
              console.log('Очистить список')
            }}
          >
            Очистить
          </Button>
        </Space>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className={styles.tabs}
        items={[
          { key: 'all', label: 'Все' },
          { key: 'orders', label: 'Заказы' },
          { key: 'achievements', label: 'Награды' },
        ]}
      />

      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.skeletons}>
            {[1, 2, 3].map(i => (
              <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
            ))}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <>
            {filteredNotifications.map(n => (
              <NotificationItem
                key={n.id}
                data={n}
                onRead={id => markRead(id)}
              />
            ))}

            {hasNextPage && (
              <div className={styles.paginationWrapper}>
                <Button
                  type="link"
                  className={styles.loadMoreBtn}
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                  icon={!isFetchingNextPage && <ArrowDownOutlined />}
                >
                  Показать еще
                </Button>
              </div>
            )}
          </>
        ) : (
          <Empty
            description="Уведомлений пока нет"
            className={styles.empty}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </div>
  )
}
