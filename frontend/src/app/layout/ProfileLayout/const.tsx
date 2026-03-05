// src/pages/profile/ui/const.tsx
import {
  UserOutlined,
  SettingOutlined,
  TrophyOutlined,
  LockOutlined,
} from '@ant-design/icons'

export const tabs = [
  { key: 'info', label: 'Мои данные', icon: <UserOutlined /> },
  { key: 'settings', label: 'Настройки', icon: <SettingOutlined /> },
  { key: 'achievements', label: 'Достижения', icon: <TrophyOutlined /> },
  { key: 'secure', label: 'Безопасность', icon: <LockOutlined /> },
]
