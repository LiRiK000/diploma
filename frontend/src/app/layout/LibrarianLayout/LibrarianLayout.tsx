import styles from './LibrarianLayout.module.scss'
import { Button, Layout, Menu, Tooltip, Typography } from 'antd'
import { librarianLayoutItems } from './constants'
import { useState } from 'react'
import { getPageTitle } from './utils'
import { TabContent } from './components/TabContent/TabContent'
import {
  BookOutlined,
  CheckCircleOutlined,
  PlusOutlined,
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

const { Content, Sider, Header } = Layout

export const LibrarianLayout = () => {
  const [selectedKey, setSelectedKey] = useState(
    localStorage.getItem('librarianSelectedKey') ?? 'dashboard',
  )
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

  const handleSave = () => {
    toggleEditing()
  }

  return (
    <Layout className={styles.layout}>
      <Sider className={styles.sider} width={200}>
        <Menu
          mode="inline"
          items={librarianLayoutItems}
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            handleMenuClick(key)
          }}
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
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined style={{ fontSize: 18 }} />}
                  onClick={handleSave}
                />
                {hasLayoutsChanged[GRID_ID] && (
                  <ResetLayoutButton fontSize={18} />
                )}
              </>
            ) : (
              <>
                <Tooltip
                  title="Добавить книги в систему"
                  placement="bottomLeft"
                >
                  <Button type="primary" icon={<PlusOutlined />} />
                </Tooltip>
                <Tooltip title="Выдать заказ" placement="bottomLeft">
                  <Button type="primary" icon={<BookOutlined />} />
                </Tooltip>
                <LibrarianSettings />
              </>
            )}
          </div>
        </Header>
        <Content className={styles.content}>
          <TabContent selectedKey={selectedKey} />
        </Content>
      </Layout>
    </Layout>
  )
}
