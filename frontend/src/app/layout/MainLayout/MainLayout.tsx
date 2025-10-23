import styles from './MainLayout.module.scss'
import { Layout } from 'antd'
import { Outlet, Link } from 'react-router-dom'
import { UserAvatar } from '@entities/user'
import { routes } from '@shared/constants'
import { MobileNavigation } from '@widgets/MobileNavigation'

const { Header, Content } = Layout

export const MainLayout = () => {
  return (
    <Layout>
      <Header className={styles.header}>
        <div>
          <Link to={routes.home} className={styles.logo}>
            Библиотека
          </Link>
          <Link to={routes.catalog} className={styles.link}>
            Каталог
          </Link>
        </div>
        <UserAvatar />
      </Header>

      <Content className={styles.content}>
        <Outlet />
      </Content>

      <MobileNavigation />
    </Layout>
  )
}
