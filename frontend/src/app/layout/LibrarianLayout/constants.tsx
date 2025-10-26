import { ShoppingOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { MenuProps } from 'antd'

export const librarianLayoutItems: MenuProps['items'] = [
  { key: 'dashboard', label: 'Главная', icon: <UnorderedListOutlined /> },
  { key: 'orders', label: 'Открытые заявки', icon: <ShoppingOutlined /> },
]
