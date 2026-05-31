import { Layout, Menu } from 'antd'
import { Menu as LucideMenu } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styles from './Profile.module.scss'
import { tabs } from './const.tsx'
import Sider from 'antd/es/layout/Sider'

const { Content } = Layout

export const ProfileLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const activeKey =
    location.pathname === '/profile'
      ? 'info'
      : location.pathname.split('/').pop() || 'info'

  const handleTabChange = (key: string) => {
    const path = key === 'info' ? '/profile' : `/profile/${key}`
    navigate(path)
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
          onClick={({ key }) => handleTabChange(key)}
        />
      </Sider>

      <Layout className={styles.contentLayout}>
        <div className={styles.mobileTabsContainer}>
          {tabs.map(tab => {
            const isActive = tab.key === activeKey
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`${styles.mobileTabItem} ${isActive ? styles.mobileTabActive : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <Content className={styles.content}>
          <div className={styles.inner}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
