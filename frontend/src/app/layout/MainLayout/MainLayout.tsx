import { Layout } from 'antd'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { UserAvatar } from '@entities/user'
import { CartIcon } from '@entities/cart/components'
import { routes } from '@shared/constants'
import { MobileNavigation } from '@widgets/MobileNavigation'
import { Search } from '@features/search'
import styles from './MainLayout.module.scss'
import { ThemeToggle } from '@features/theme-toggle/ui/ThemeToggle'

const { Header, Content } = Layout

export const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className={styles.header}>
        <div className={styles.blob} />
        <div className={styles.headerLeft}>
          <Link to={routes.home} className={styles.logo}>
            Библиотека
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
            <Link to={routes.orders} className={styles.link}>
              Мои заявки
            </Link>
          </nav>
        </div>

        <div className={styles.headerCenter}>
          <Search />
        </div>

        <div className={styles.headerRight}>
          <CartIcon />
          <UserAvatar />
          <ThemeToggle />
        </div>
      </Header>

      <Content className={styles.content}>
        <Outlet />
      </Content>

      <MobileNavigation />
    </Layout>
  )
}
