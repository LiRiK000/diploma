import { ProfileInfoTab } from '@widgets/ProfileInfoTab'
import {
  UserOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined,
} from '@ant-design/icons'

export const tabs = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: 'Профиль',
  },
  {
    key: 'achievements',
    icon: <TrophyOutlined />,
    label: 'Достижения',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Настройки',
  },
  {
    key: 'security',
    icon: <SafetyCertificateOutlined />,
    label: 'Безопасность',
  },
]

export const TAB_COMPONENTS = {
  profile: <ProfileInfoTab />,
  // settings: <SettingsTab />,
  // security: <SecurityTab />,
} as const
