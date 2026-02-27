import { Layout } from 'antd'
import { Outlet, Link } from 'react-router-dom'
import { UserAvatar } from '@entities/user'
import { CartIcon } from '@entities/cart/components'
import { routes } from '@shared/constants'
import { MobileNavigation } from '@widgets/MobileNavigation'
import { Search } from '@features/search'
import styles from './MainLayout.module.scss'

const { Header, Content } = Layout

export const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to={routes.home} className={styles.logo}>
            Библиотека
          </Link>
          <nav className={styles.navLinks}>
            <Link to={routes.catalog} className={styles.link}>
              Каталог
            </Link>
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
        </div>
      </Header>

      <Content className={styles.content}>
        <Outlet />
      </Content>

      <MobileNavigation />
    </Layout>
  )
}
