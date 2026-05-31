import { Badge, Avatar } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import { routes } from '@shared/constants'
import styles from './NotificationIcon.module.scss'
import { useNotifications } from '@entities/notifications/hooks/useNotifications'

export const NotificationIcon = () => {
  const { unreadCount } = useNotifications()
  return (
    <NavLink
      to={routes.notifications}
      className={({ isActive }) =>
        isActive
          ? `${styles.notificationAction} ${styles.notificationActionActive}`
          : styles.notificationAction
      }
    >
      <Badge
        count={unreadCount}
        size="small"
        offset={[-2, 2]}
        className={styles.badge}
      >
        <Avatar shape="square" icon={<BellOutlined />} />
      </Badge>
    </NavLink>
  )
}
