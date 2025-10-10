import React from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Space } from 'antd'

export const AvatarComp: React.FC = () => (
  <Space size={24}>
    <Badge count={1}>
      <Avatar shape="square" icon={<UserOutlined />} />
    </Badge>
  </Space>
)
