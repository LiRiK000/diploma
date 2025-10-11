import styles from './MainLayout.module.scss'
import { Layout, Input, Space, Badge, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Outlet, Link } from 'react-router-dom'
import { showSearch } from './utils'
import { Activity } from 'react'

const { Header, Content } = Layout
const { Search } = Input

export const MainLayout = () => {
  const handleSearch = (value: string) => {
    console.log(value)
  }

  const isShowSearch = showSearch(location.pathname)

  return (
    <Layout className={styles.root}>
      <Header className={styles.header}>
        <div>
          <div className={styles.logo}>Библиотека</div>
          <Link to="/catalog" className={styles.catalog}>
            Каталог
          </Link>
        </div>
        <Activity mode={isShowSearch ? 'visible' : 'hidden'}>
          <Search
            placeholder="Поиск книги..."
            allowClear
            onSearch={handleSearch}
            className={styles.search}
          />
        </Activity>
        <Space size={24}>
          <Badge count={1}>
            <Avatar shape="square" icon={<UserOutlined />} />
          </Badge>
        </Space>
      </Header>

      <Content className={styles.content}>
        <Outlet />
      </Content>

      <nav className={styles.mobileNav}>
        <Link to="/">Главная</Link>
        <Link to="/catalog">Каталог</Link>
        <Link to="/cart">Корзина</Link>
        <Space size={24}>
          <Badge count={1}>
            <Avatar shape="square" icon={<UserOutlined />} />
          </Badge>
        </Space>
      </nav>
    </Layout>
  )
}
