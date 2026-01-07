import { MenuProps } from 'antd'
import {
  BellOutlined,
  BookOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { NavigateFunction } from 'react-router-dom'
import { routes } from '@shared/constants'
import { USER_ROLES } from '../../constants'

export const getDropdownItems = (
  navigate: NavigateFunction,
  userRole: (typeof USER_ROLES)[keyof typeof USER_ROLES],
): MenuProps['items'] => {
  const items = [
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

  return items
}
