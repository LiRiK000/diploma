import { Button, Drawer, Layout, Menu } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styles from './Profile.module.scss'
import { tabs } from './const.tsx'
import Sider from 'antd/es/layout/Sider'

const { Content } = Layout

export const ProfileLayout = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const activeKey =
    location.pathname === '/profile'
      ? 'info'
      : location.pathname.split('/').pop() || 'info'

  const currentTabLabel =
    tabs.find(tab => tab.key === activeKey)?.label || 'Профиль'

  const handleMenuClick = ({ key }: { key: string }) => {
    const path = key === 'info' ? '/profile' : `/profile/${key}`
    navigate(path)
    setDrawerVisible(false)
  }

  return (
    <Layout className={styles.layout}>
      <Sider
        className={styles.sider}
        width={260}
        breakpoint="lg"
        collapsedWidth={0}
        trigger={null}
      >
        <div className={styles.siderHeader}>Аккаунт</div>

        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={tabs}
          onClick={handleMenuClick}
        />
      </Sider>

      <Drawer
        open={drawerVisible}
        placement="left"
        width={280}
        onClose={() => setDrawerVisible(false)}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={tabs}
          onClick={handleMenuClick}
        />
      </Drawer>

      <Layout className={styles.contentLayout}>
        <Content className={styles.content}>
          <div className={styles.mobileHeader}>
            <Button
              icon={<MenuOutlined />}
              type="text"
              onClick={() => setDrawerVisible(true)}
              className={styles.burger}
            />

            <span className={styles.mobileTitle}>{currentTabLabel}</span>
          </div>

          <div className={styles.inner}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
