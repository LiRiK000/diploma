import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import styles from './NotificationsPage.module.scss'
import { NotificationsWidget } from '@widgets/Notifications/ui/NotificationsWidget/NotificationsWidget'

export const NotificationsPage = () => {
  return (
    <main className={styles.page}>
      <div className={styles.ambientGlow} />

      <div className={styles.wrapper}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[
            { title: <Link to="/">Главная</Link> },
            { title: 'Профиль' },
            { title: 'Уведомления' },
          ]}
        />
        <NotificationsWidget />
      </div>
    </main>
  )
}
