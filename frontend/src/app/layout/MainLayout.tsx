import { Layout, Input } from 'antd'
import { Outlet, Link } from 'react-router-dom'
import styles from './layout.module.scss'
import { AvatarComp } from '@widgets/Avatarw'
import { MainLayoutProps } from './type'
const { Header, Content } = Layout
const { Search } = Input

export const MainLayout = ({ onSearch }: MainLayoutProps) => {
  return (
    <Layout className={styles.root}>
      <Header className={styles.header}>
        <div>
          <div className={styles.logo}>Библиотека</div>
          <Link to="/catalog" className={styles.catalog}>
            Каталог
          </Link>
        </div>
        <Search
          placeholder="Поиск книги..."
          allowClear
          onSearch={onSearch}
          className={styles.search}
        />
        <AvatarComp />
      </Header>

      <Content className={styles.content}>
        <Outlet />
      </Content>

      <nav className={styles.mobileNav}>
        <Link to="/">Главная</Link>
        <Link to="/catalog">Каталог</Link>
        <Link to="/cart">Корзина</Link>
        <AvatarComp />
      </nav>
    </Layout>
  )
}
