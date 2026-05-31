import { User, Settings, Trophy, ShieldCheck } from 'lucide-react'

export const tabs = [
  {
    key: 'info',
    label: 'Мои данные',
    icon: <User size={18} strokeWidth={2} />,
  },
  {
    key: 'settings',
    label: 'Настройки',
    icon: <Settings size={18} strokeWidth={2} />,
  },
  {
    key: 'achievements',
    label: 'Достижения',
    icon: <Trophy size={18} strokeWidth={2} />,
  },
  {
    key: 'secure',
    label: 'Безопасность',
    icon: <ShieldCheck size={18} strokeWidth={2} />,
  },
]
