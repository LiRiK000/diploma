import { MenuProps } from 'antd'
import {
  BellOutlined,
  BookOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { NavigateFunction } from 'react-router-dom'
import { routes } from '@shared/constants'
import { USER_ROLES } from '../../constants'
import type { UserRole } from '@shared/services/Auth/types'

export const getDropdownItems = (
  navigate: NavigateFunction,
  userRole?: UserRole,
  onLogout?: () => void,
): MenuProps['items'] => {
  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Профиль',
      icon: <UserOutlined />,
      onClick: () => navigate(routes.profile),
    },
    {
      key: 'cart',
      label: 'Корзина',
      icon: <ShoppingCartOutlined />,
      onClick: () => navigate(routes.cart),
    },
    {
      key: 'notifications',
      label: 'Уведомления',
      icon: <BellOutlined />,
      onClick: () => navigate(routes.notifications),
    },
  ]

  if (userRole === USER_ROLES.LIBRARIAN) {
    items.push({
      key: 'librarian',
      label: 'Управление',
      icon: <BookOutlined />,
      onClick: () => navigate(routes.librarian),
    })
  }

  items.push(
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Выйти',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: onLogout,
    },
  )

  return items
}
