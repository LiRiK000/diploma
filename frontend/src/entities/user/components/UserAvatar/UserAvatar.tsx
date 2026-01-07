import { UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Dropdown, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getDropdownItems } from './utils'
import { routes } from '@shared/constants'
import { USER_ROLES } from '../../constants'

export const UserAvatar = ({ mobile }: { mobile?: boolean }) => {
  const navigate = useNavigate()
  // TODO: get user role from store
  const dropdownItems = getDropdownItems(navigate, USER_ROLES.LIBRARIAN)

  if (mobile) {
    return (
      <Avatar
        onClick={() => navigate(routes.profile)}
        icon={<UserOutlined />}
        style={{ background: 'none', cursor: 'pointer' }}
      />
    )
  }

  return (
    <Space size={24} style={{ cursor: 'pointer' }}>
      <Badge count={1}>
        <Dropdown
          trigger={['click']}
          menu={{
            items: dropdownItems,
          }}
        >
          <Avatar
            shape="square"
            icon={<UserOutlined />}
            style={{ background: 'none' }}
          />
        </Dropdown>
      </Badge>
    </Space>
  )
}
