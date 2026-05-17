import { useState } from 'react'
import { Layout, Menu, Typography, Avatar } from 'antd'
import { useShallow } from 'zustand/react/shallow'
import { LucideUser } from 'lucide-react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import clsx from 'clsx'

import { librarianMenuFields } from './constants'
import { VerifyCodeModal } from '@features/manage-orders/ui/VerifyCodeModal'
import { ReturnBookModal } from '@features/manage-orders/ui/ReturnBookModal'
import { WidgetBuilderDrawer } from '@features/widget-builder/ui/WidgetBuilderDrawer/WidgetBuilderDrawer'
import { useLibrarianSettingsStore } from '@features/librarian-settings'
import { useLayoutStore } from '@entities/widgets-grid'
import { GRID_ID } from '@entities/widgets-grid/constants'
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

  const { hasLayoutsChanged, commitLayouts } = useLayoutStore(
    useShallow(state => ({
      hasLayoutsChanged: !!state.hasLayoutsChanged[GRID_ID],
      commitLayouts: state.commitLayouts,
    })),
  )

  const getCurrentTitle = () => {
    if (pathname.includes('/orders/')) return 'Детали заказа'
    const currentMenuItem = librarianMenuFields.find(item =>
      pathname.includes(item.key),
    )
    return currentMenuItem?.label || 'Панель управления'
  }

  const handleSaveAction = () => {
    commitLayouts()
    toggleEditing()
  }

  return (
    <Layout className={styles.layout}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className={styles.sider}
        width={256} // Чуть увеличили для лучшей читаемости текста меню
        trigger={null} // Если хочешь кастомный триггер в шапке, можно убрать, но дефолтный antd триггер снизу тоже ок
      >
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

        {/* Прокачанный блок профиля */}
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

      {/* margin-left убран! flex: 1 сам сделает адаптивный расчет ширины */}
      <Layout className={styles.rightLayout}>
        <Header className={styles.header}>
          <Typography.Title level={3} className={styles.title}>
            {getCurrentTitle()}
          </Typography.Title>

          <HeaderActions
            isEditing={isEditing}
            toggleEditing={isEditing ? handleSaveAction : toggleEditing}
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
