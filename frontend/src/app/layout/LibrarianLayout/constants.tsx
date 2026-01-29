import {
  BookOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { MenuProps } from 'antd'

export const librarianLayoutItems: MenuProps['items'] = [
  { key: 'dashboard', label: 'Главная', icon: <UnorderedListOutlined /> },
  { key: 'orders', label: 'Открытые заявки', icon: <ShoppingOutlined /> },
  { key: 'books', label: 'Книги', icon: <BookOutlined /> },
  { key: 'authors', label: 'Авторы', icon: <TeamOutlined /> },
]
