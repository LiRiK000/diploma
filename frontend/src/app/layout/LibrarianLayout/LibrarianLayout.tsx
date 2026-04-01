import styles from './LibrarianLayout.module.scss'
import { Button, Layout, Menu, Tooltip, Typography } from 'antd'
import { librarianLayoutItems } from './constants'
import { useState } from 'react'
import { getPageTitle } from './utils'
import { TabContent } from './components/TabContent/TabContent'
import {
  BookOutlined,
  CheckCircleOutlined,
  InboxOutlined,
} from '@ant-design/icons'
import {
  LibrarianSettings,
  useLibrarianSettingsStore,
} from '@features/librarian-settings'
import { useShallow } from 'zustand/react/shallow'
import {
  GRID_ID,
  ResetLayoutButton,
  useLayoutStore,
} from '@entities/widgets-grid'
import { VerifyCodeModal } from '@features/manage-orders/ui/VerifyCodeModal'
import { ReturnBookModal } from '@features/manage-orders/ui/ReturnBookModal'
import { ThemeToggle } from '@features/theme-toggle/ui/ThemeToggle'
import { useWidgetBuilderStore } from '@features/widget-builder/model/useWidgetBuilderStore'
import { WidgetBuilderTrigger } from '@features/widget-builder'
import { WidgetBuilderDrawer } from '@features/widget-builder/ui/WidgetBuilderDrawer/WidgetBuilderDrawer'

const { Content, Sider, Header } = Layout

export const LibrarianLayout = () => {
  const [selectedKey, setSelectedKey] = useState(
    localStorage.getItem('librarianSelectedKey') ?? 'dashboard',
  )

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
  const setWidgetBuilderOpen = useWidgetBuilderStore(state => state.setOpen)

  const { isEditing, toggleEditing } = useLibrarianSettingsStore(
    useShallow(store => ({
      isEditing: store.isEditing,
      toggleEditing: store.toggleEditing,
    })),
  )

  const [hasLayoutsChanged] = useLayoutStore(
    useShallow(store => [store.hasLayoutsChanged]),
  )

  const handleMenuClick = (key: string) => {
    setSelectedKey(key)
    localStorage.setItem('librarianSelectedKey', key)
  }

  return (
    <Layout className={styles.layout}>
      <Sider className={styles.sider} width={200}>
        <Menu
          mode="inline"
          items={librarianLayoutItems}
          selectedKeys={[selectedKey]}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>

      <Layout className={styles.rightLayout}>
        <Header className={styles.header}>
          <Typography.Title level={2} className={styles.title}>
            {getPageTitle(selectedKey)}
          </Typography.Title>

          <div className={styles.headerActions}>
            {isEditing ? (
              <>
                <WidgetBuilderTrigger
                  onClick={() => setWidgetBuilderOpen(true)}
                />

                <Button
                  type="primary"
                  icon={<CheckCircleOutlined style={{ fontSize: 18 }} />}
                  onClick={toggleEditing}
                />

                {hasLayoutsChanged[GRID_ID] && (
                  <ResetLayoutButton fontSize={18} />
                )}
              </>
            ) : (
              <>
                <Tooltip title="Выдать заказ по коду" placement="bottomLeft">
                  <Button
                    type="primary"
                    icon={<BookOutlined />}
                    onClick={() => setIsVerifyModalOpen(true)}
                  />
                </Tooltip>

                <Tooltip title="Принять возврат книг" placement="bottomLeft">
                  <Button
                    icon={<InboxOutlined />}
                    style={{
                      backgroundColor: '#52c41a',
                      borderColor: '#52c41a',
                      color: '#fff',
                    }}
                    onClick={() => setIsReturnModalOpen(true)}
                  />
                </Tooltip>

                <LibrarianSettings />
              </>
            )}
            <ThemeToggle />
          </div>
        </Header>

        <Content className={styles.content}>
          <TabContent selectedKey={selectedKey} />
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
