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
      checkedChildren={<MoonOutlined style={{ color: '#ffffff' }} />}
      unCheckedChildren={<SunOutlined style={{ color: '#fa8c16' }} />}
      style={{
        backgroundColor: isDark ? '#177ddc' : '#ffe7ba',
        borderColor: isDark ? '#177ddc' : '#ffe7ba',
      }}
    />
  )
}
