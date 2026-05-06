import { useState } from 'react'
import { Layout, Menu, Typography, Avatar } from 'antd'
import { useShallow } from 'zustand/react/shallow'
import { LucideUser } from 'lucide-react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { librarianMenuFields } from './constants'
import { VerifyCodeModal } from '@features/manage-orders/ui/VerifyCodeModal'
import { ReturnBookModal } from '@features/manage-orders/ui/ReturnBookModal'
import { WidgetBuilderDrawer } from '@features/widget-builder/ui/WidgetBuilderDrawer/WidgetBuilderDrawer'
import { useLibrarianSettingsStore } from '@features/librarian-settings'
import { useLayoutStore } from '@entities/widgets-grid'
import { useWidgetBuilderStore } from '@features/widget-builder/model/useWidgetBuilderStore'

import styles from './LibrarianLayout.module.scss'
import { HeaderActions } from './components/HeaderActions/HeaderActions'

const { Content, Sider, Header } = Layout

export const LibrarianLayout = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)

  const setWidgetBuilderOpen = useWidgetBuilderStore(state => state.setOpen)
  const { isEditing, toggleEditing } = useLibrarianSettingsStore(
    useShallow(s => ({
      isEditing: s.isEditing,
      toggleEditing: s.toggleEditing,
    })),
  )
  const [hasLayoutsChanged] = useLayoutStore(
    useShallow(s => [s.hasLayoutsChanged]),
  )

  const getCurrentTitle = () => {
    if (pathname.includes('/orders/')) return 'Детали заказа'
    const currentMenuItem = librarianMenuFields.find(item =>
      pathname.includes(item.key),
    )
    return currentMenuItem?.label || 'Панель управления'
  }

  return (
    <Layout className={styles.layout} hasSider>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className={styles.sider}
        width={240}
      >
        <div className={styles.logoContainer}>
          <div className={styles.logoCircle} />
        </div>

        <Menu
          mode="inline"
          items={librarianMenuFields}
          selectedKeys={[pathname]}
          onClick={({ key }) => navigate(key)}
        />

        <div className={styles.siderFooter}>
          <Avatar icon={<LucideUser size={18} />} />
          {!collapsed && <span className={styles.userName}>Администратор</span>}
        </div>
      </Sider>

      <Layout
        className={styles.rightLayout}
        style={{ marginLeft: collapsed ? 80 : 240 }}
      >
        <Header className={styles.header}>
          <Typography.Title level={3} className={styles.title}>
            {getCurrentTitle()}
          </Typography.Title>

          <HeaderActions
            isEditing={isEditing}
            toggleEditing={toggleEditing}
            hasLayoutsChanged={hasLayoutsChanged}
            onVerifyOpen={() => setIsVerifyModalOpen(true)}
            onReturnOpen={() => setIsReturnModalOpen(true)}
            setWidgetBuilderOpen={setWidgetBuilderOpen}
          />
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>

      <VerifyCodeModal
        open={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
      <ReturnBookModal
        open={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
      />
      <WidgetBuilderDrawer />
    </Layout>
  )
}
