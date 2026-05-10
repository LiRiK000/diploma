import { Typography } from 'antd'
import {
  BellOutlined,
  ShoppingOutlined,
  TrophyOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import classNames from 'classnames'

import styles from './NotificationItem.module.scss'
import { NotificationType } from '@entities/notifications/types'

dayjs.extend(relativeTime)
const { Text, Title } = Typography

const ICON_MAP = {
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
  return (
    <div
      className={classNames(styles.card, { [styles.unread]: !data.isViewed })}
      onClick={() => onRead(data.id)}
    >
      <div
        className={classNames(styles.iconBox, styles[data.type.toLowerCase()])}
      >
        {ICON_MAP[data.type]}
      </div>

      <div className={styles.body}>
        <div className={styles.headerRow}>
          <Title level={5} className={styles.title}>
            {data.title}
          </Title>
          <Text className={styles.time}>{dayjs(data.createdAt).fromNow()}</Text>
        </div>
        <Text className={styles.message}>{data.message}</Text>
      </div>

      {!data.isViewed && <div className={styles.glowIndicator} />}
    </div>
  )
}
