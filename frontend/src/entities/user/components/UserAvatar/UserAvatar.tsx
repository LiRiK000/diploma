import { Avatar, Badge, Dropdown, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getDropdownItems } from './utils'
import { routes } from '@shared/constants'
import { USER_ROLES } from '../../constants'
import { UserOutlined } from '@ant-design/icons'
export const UserAvatar = ({ mobile }: { mobile?: boolean }) => {
  const navigate = useNavigate()
  const dropdownItems = getDropdownItems(navigate, USER_ROLES.LIBRARIAN)

  const avatarStyle = {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  }

  if (mobile) {
    return (
      <Avatar
        onClick={() => void navigate(routes.profile)}
        icon={<UserOutlined style={{ color: 'var(--text-primary)' }} />}
        style={avatarStyle}
      />
    )
  }

  return (
    <Space size={24} style={{ cursor: 'pointer' }}>
      <Badge count={1} size="small">
        <Dropdown
          trigger={['click']}
          menu={{
            items: dropdownItems,
          }}
        >
          <Avatar
            shape="square"
            icon={<UserOutlined style={{ color: 'var(--text-primary)' }} />}
            style={avatarStyle}
          />
        </Dropdown>
      </Badge>
    </Space>
  )
}
