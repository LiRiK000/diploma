import { useState } from 'react'
import { Tabs, Button, Space, Typography, Empty } from 'antd'
import { DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons'
import styles from './NotificationsWidget.module.scss'
import { NotificationItem } from '@entities/notifications/ui/NotificationItem/NotificationItem'

const { Title, Text } = Typography

export const NotificationsWidget = () => {
  const [activeTab, setActiveTab] = useState('all')

  const notifications = [
    {
      id: '1',
      type: 'OVERDUE',
      title: 'Срок возврата истек',
      message: 'Пожалуйста, верните "Ведьмак" до завтра.',
      isViewed: false,
      createdAt: new Date().toISOString(),
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={2} className={styles.mainTitle}>
            Уведомления
          </Title>
          <Text type="secondary">
            Ваша лента активности и системные сообщения
          </Text>
        </div>
        <Space>
          <Button type="text" icon={<CheckCircleOutlined />}>
            Прочитать все
          </Button>
          <Button type="text" danger icon={<DeleteOutlined />}>
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
        {notifications.length > 0 ? (
          notifications.map(n => (
            <NotificationItem
              key={n.id}
              data={n as any}
              onRead={id => console.log(id)}
            />
          ))
        ) : (
          <Empty description="Уведомлений пока нет" className={styles.empty} />
        )}
      </div>
    </div>
  )
}
