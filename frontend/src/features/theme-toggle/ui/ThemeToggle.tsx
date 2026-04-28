import { Switch } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useThemeStore } from '@entities/theme/model/store'

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore()

  const handleToggle = () => {
    if (!document.startViewTransition) {
      toggleTheme()
      return
    }

    document.startViewTransition(() => {
      toggleTheme()
    })
  }

  return (
    <Switch
      checked={isDark}
      onChange={handleToggle}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
    />
  )
}
