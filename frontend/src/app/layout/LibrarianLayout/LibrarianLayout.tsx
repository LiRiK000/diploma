import { useState } from 'react'
import { Layout, Menu, Typography, Avatar } from 'antd'
import { useShallow } from 'zustand/react/shallow'
import { LucideUser, ChevronLeft } from 'lucide-react' // Добавили иконку стрелки
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import clsx from 'clsx'

import { librarianMenuFields } from './constants'
import { VerifyCodeModal } from '@features/manage-orders/ui/VerifyCodeModal'
import { ReturnBookModal } from '@features/manage-orders/ui/ReturnBookModal'
import { useLibrarianSettingsStore } from '@features/librarian-settings'

import styles from './LibrarianLayout.module.scss'
import { HeaderActions } from './components/HeaderActions/HeaderActions'

const { Content, Sider, Header } = Layout

export const LibrarianLayout = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)

  const { isEditing, toggleEditing } = useLibrarianSettingsStore(
    useShallow(s => ({
      isEditing: s.isEditing,
      toggleEditing: s.toggleEditing,
    })),
  )

  const getCurrentTitle = () => {
    if (pathname.includes('/orders/')) return 'Детали заказа'
    const currentMenuItem = librarianMenuFields.find(item =>
      pathname.includes(item.key),
    )
    return currentMenuItem?.label || 'Панель управления'
  }

  return (
    <Layout className={styles.layout}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className={`${styles.sider} tour-step-sider-menu`}
        width={260} // Немного увеличили ширину для свободы текста
        trigger={null}
      >
        {/* Кнопка сворачивания меню на стыке блоков */}
        <div
          className={clsx(
            styles.customTrigger,
            collapsed && styles.collapsedActive,
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft size={16} />
        </div>

        <div className={styles.logoContainer}>
          <div className={styles.logoCircle} />
          <span className={clsx(styles.logoText, collapsed && styles.hidden)}>
            Media Center
          </span>
        </div>

        <Menu
          mode="inline"
          items={librarianMenuFields}
          selectedKeys={[pathname]}
          onClick={({ key }) => navigate(key)}
        />

        <div className={styles.siderFooter}>
          <Avatar
            className={styles.userAvatar}
            icon={<LucideUser size={18} />}
            size={36}
          />
          <div className={clsx(styles.userInfo, collapsed && styles.hidden)}>
            <span className={styles.userName}>Администратор</span>
            <span className={styles.userRole}>Главный библиотекарь</span>
          </div>
        </div>
      </Sider>

      <Layout className={styles.rightLayout}>
        <Header className={styles.header}>
          <Typography.Title level={3} className={styles.title}>
            {getCurrentTitle()}
          </Typography.Title>

          <div className="tour-step-header-actions">
            <HeaderActions
              isEditing={isEditing}
              toggleEditing={
                isEditing ? () => console.log('save') : toggleEditing
              }
              onVerifyOpen={() => setIsVerifyModalOpen(true)}
              onReturnOpen={() => setIsReturnModalOpen(true)}
            />
          </div>
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
    </Layout>
  )
}
