import styles from './LibrarianLayout.module.scss'
import { Button, Layout, Menu, Tooltip, Typography } from 'antd'
import { librarianLayoutItems } from './constants'
import { useState } from 'react'
import { getPageTitle } from './utils'
import { TabContent } from './components/TabContent/TabContent'
import { BookOutlined, PlusOutlined } from '@ant-design/icons'
import { LibrarianSettings } from '@features/librarian-settings'

const { Content, Sider, Header } = Layout

export const LibrarianLayout = () => {
  const [selectedKey, setSelectedKey] = useState(
    localStorage.getItem('librarianSelectedKey') ?? 'dashboard',
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
            <Tooltip title="Добавить книги в систему" placement="bottomLeft">
              <Button type="primary" icon={<PlusOutlined />} />
            </Tooltip>
            <Tooltip title="Выдать заказ" placement="bottomLeft">
              <Button type="primary" icon={<BookOutlined />} />
            </Tooltip>
            <LibrarianSettings />
          </div>
        </Header>
        <Content className={styles.content}>
          <TabContent selectedKey={selectedKey} />
        </Content>
      </Layout>
    </Layout>
  )
}
