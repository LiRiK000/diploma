import { Avatar, Dropdown } from 'antd'
import { useNavigate } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'

import { getDropdownItems } from './utils'
import { routes } from '@shared/constants'
import { useGetMe } from '@app/providers/AuthProvider/hooks/useGetMe'
import styles from './UserAvatar.module.scss'
import { User } from 'lucide-react'

export const UserAvatar = ({ mobile }: { mobile?: boolean }) => {
  const navigate = useNavigate()
  const { data: me } = useGetMe()
  const dropdownItems = getDropdownItems(navigate, me?.role)

  if (mobile) {
    return (
      <Avatar
        onClick={() => void navigate(routes.profile)}
        icon={<User />}
        className={styles.mobileAvatar}
      />
    )
  }

  return (
    <Dropdown trigger={['click']} menu={{ items: dropdownItems }}>
      <div className={styles.avatarWrapper}>
        <Avatar shape="square" icon={<UserOutlined />} />
      </div>
    </Dropdown>
  )
}
