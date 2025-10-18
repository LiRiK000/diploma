import { Layout, Menu } from 'antd'
import { useState } from 'react'
import classes from './Profile.module.scss'
import { tabs } from './constants'
import { TabContentSwitcher } from './components/TabContentSwitcher/TabContentSwitcher'

const { Content, Sider } = Layout

export const ProfilePage = () => {
  const [selectedKey, setSelectedKey] = useState('profile')

  return (
    <Layout className={classes.layout}>
      <Sider className={classes.sider} width={200}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={tabs}
          onClick={({ key }) => setSelectedKey(key)}
          className={classes.menu}
        />
      </Sider>
      <Content className={classes.content}>
        <TabContentSwitcher selectedKey={selectedKey} />
      </Content>
    </Layout>
  )
}
