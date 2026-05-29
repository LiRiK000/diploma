import { Layout, Badge } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { UserAvatar } from '@entities/user'
import { CartIcon } from '@entities/cart/components'
import { routes } from '@shared/constants'
import { MobileNavigation } from '@widgets/MobileNavigation'
import { Search } from '@features/search'
import { ThemeToggle } from '@features/theme-toggle/ui/ThemeToggle'
import styles from './MainLayout.module.scss'
import { PullAnchor } from '@shared/components/PullAnchor'
import { Logo } from '../../../../public/logo'
import { useNotifications } from '@entities/notifications/hooks/useNotifications'

const { Header, Content } = Layout

export const MainLayout = () => {
  const navigate = useNavigate()
  const { unreadCount } = useNotifications()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className={styles.header}>
        <div className={styles.backgroundWrapper}>
          <div className={`${styles.blob} ${styles.blobOne}`} />
          <div className={`${styles.blob} ${styles.blobTwo}`} />
          <div className={`${styles.blob} ${styles.blobThree}`} />
        </div>

        <div className={styles.headerLeft}>
          <Link to={routes.home} className={styles.logo}>
            <Logo />
          </Link>
          <nav className={styles.navLinks}>
            <NavLink
              to={routes.catalog}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.liquidActive}` : styles.link
              }
            >
              Каталог
            </NavLink>
            <NavLink
              to={routes.orders}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.liquidActive}` : styles.link
              }
            >
              Мои заявки
            </NavLink>
          </nav>
        </div>

        <div className={styles.headerCenter}>
          <Search />
        </div>

        <div className={styles.headerRight}>
          <div
            className={styles.notificationWrapper}
            style={{ cursor: 'pointer' }}
            onClick={() => void navigate(routes.notifications)}
          >
            <Badge count={unreadCount} size="small" offset={[-2, 2]}>
              <BellOutlined style={{ fontSize: '20px', color: 'inherit' }} />
            </Badge>
          </div>

          <CartIcon />
          <UserAvatar />
          <ThemeToggle />
        </div>
      </Header>

      <Content className={styles.content}>
        <Outlet />
      </Content>

      <MobileNavigation />

      <PullAnchor />
    </Layout>
  )
}
