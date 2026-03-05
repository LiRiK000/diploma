import { ConfigProvider, theme } from 'antd'
import { ReactNode, useEffect } from 'react'
import { useThemeStore } from '@entities/theme/model/store'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const isDark = useThemeStore(state => state.isDark)
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [isDark])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#3b82f6',
          borderRadius: 14,
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
