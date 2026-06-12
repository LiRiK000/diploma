import { Layout } from 'antd'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { UserAvatar } from '@entities/user'
import { CartIcon } from '@entities/cart/components'
import { routes } from '@shared/constants'
import { MobileNavigation } from '@widgets/MobileNavigation'
import { Search } from '@features/search'
import { ThemeToggle } from '@features/theme-toggle/ui/ThemeToggle'
import { AccountBlockBanner } from '@widgets/AccountBlockBanner'
import styles from './MainLayout.module.scss'
import { PullAnchor } from '@shared/components/PullAnchor'
import { Logo } from '../../../../public/logo'
import { NotificationIcon } from '@entities/notifications/ui/NotificationIcon/NotificationIcon'
import { useGetMe } from '@app/providers/AuthProvider/hooks/useGetMe'

const { Header, Content } = Layout

export const MainLayout = () => {
  const { data, isLoading, isError } = useGetMe()
  const isAuthenticated = !isLoading && !isError && data?.status === 'success'

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
          <NotificationIcon />

          <CartIcon />

          {isAuthenticated && <UserAvatar />}

          <ThemeToggle />
        </div>
      </Header>

      <AccountBlockBanner />

      <Content className={styles.content}>
        <Outlet />
      </Content>

      {isAuthenticated && <MobileNavigation />}

      <PullAnchor />
    </Layout>
  )
}
