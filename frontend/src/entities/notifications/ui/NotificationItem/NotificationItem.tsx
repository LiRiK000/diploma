import { Typography } from 'antd'
import {
  BellOutlined,
  ShoppingOutlined,
  TrophyOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import classNames from 'classnames'

import { Notification, NotificationType } from '@entities/notifications/types'
import styles from './NotificationItem.module.scss'
import { formatNotificationDate } from '@shared/utils/dataFormater'

const { Text, Title } = Typography

const ICON_MAP: Record<NotificationType, React.ReactNode> = {
  [NotificationType.ORDER_STATUS]: <ShoppingOutlined />,
  [NotificationType.ACHIEVEMENT]: <TrophyOutlined />,
  [NotificationType.OVERDUE]: <WarningOutlined />,
  [NotificationType.NEW_ARRIVAL]: <BellOutlined />,
  [NotificationType.SYSTEM]: <InfoCircleOutlined />,
  [NotificationType.REMINDER]: <ClockCircleOutlined />,
}

interface Props {
  data: Notification
  onRead: (id: string) => void
}

export const NotificationItem = ({ data, onRead }: Props) => {
  const typeKey = data.type?.toLowerCase() as keyof typeof styles

  return (
    <div
      className={classNames(styles.card, { [styles.unread]: !data.isViewed })}
      onClick={() => !data.isViewed && onRead(data.id)}
    >
      <div className={classNames(styles.iconBox, styles[typeKey])}>
        {ICON_MAP[data.type] || <BellOutlined />}
      </div>

      <div className={styles.body}>
        <div className={styles.headerRow}>
          <Title level={5} className={styles.title}>
            {data.title === 'ысысы' || data.title === 'ысыс'
              ? 'Системное уведомление'
              : data.title}
          </Title>
          <Text className={styles.time}>
            {formatNotificationDate(data.createdAt)}
          </Text>
        </div>
        <Text className={styles.message}>{data.message}</Text>
      </div>

      {!data.isViewed && <div className={styles.glowIndicator} />}
    </div>
  )
}
