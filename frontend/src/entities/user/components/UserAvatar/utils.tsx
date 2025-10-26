import { MenuProps } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { NavigateFunction } from 'react-router-dom'
import { routes } from '@shared/constants'

export const getDropdownItems = (
  navigate: NavigateFunction,
): MenuProps['items'] => {
  return [
    {
      key: 'profile',
      label: 'Профиль',
      icon: <UserOutlined />,
      onClick: () => navigate(routes.profile),
    },
  ]
}
