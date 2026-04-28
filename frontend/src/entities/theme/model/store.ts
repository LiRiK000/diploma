import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
}
export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      isDark: document.body.classList.contains('dark'), // Берем реальное состояние
      toggleTheme: () =>
        set(state => {
          const nextDark = !state.isDark

          // Мгновенно меняем класс на body без ожидания React
          if (nextDark) {
            document.body.classList.add('dark')
          } else {
            document.body.classList.remove('dark')
          }

          return { isDark: nextDark }
        }),
    }),
    { name: 'theme-storage' },
  ),
)
