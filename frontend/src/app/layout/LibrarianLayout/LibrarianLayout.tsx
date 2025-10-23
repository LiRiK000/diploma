import styles from './LibrarianLayout.module.scss'
import { Button, Layout, Menu, Typography } from 'antd'
import { librarianLayoutItems } from './constants'
import { useState } from 'react'
import { getPageTitle } from './utils'
import { TabContent } from './components/TabContent/TabContent'

const { Content, Sider, Header } = Layout

export const LibrarianLayout = () => {
  const [selectedKey, setSelectedKey] = useState('dashboard')

  return (
    <Layout>
      <Sider
        className={styles.sider}
        width={200}
        style={{ background: 'white' }}
      >
        <Menu
          mode="inline"
          items={librarianLayoutItems}
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            setSelectedKey(key)
          }}
        />
      </Sider>
      <Content className={styles.content}>
        <Header className={styles.header}>
          <div className={styles.headerContent}>
            <Typography.Title level={2}>
              {getPageTitle(selectedKey)}
            </Typography.Title>
            <Button type="primary">123</Button>
          </div>
        </Header>
        <TabContent selectedKey={selectedKey} />
      </Content>
    </Layout>
  )
}
