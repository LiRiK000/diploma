import { useEffect } from 'react'
import { useLocation } from 'react-router-dom' // Импортируем хук роутера
import { useShallow } from 'zustand/react/shallow'
import { loadYandexMetrika } from './utils'
import { YANDEX_COUNTER_ID } from './constants'
import { useCookieConsentStore } from '@features/cookie/model/store'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const consent = useCookieConsentStore(useShallow(state => state.consent))
  const location = useLocation() // Слушаем изменение URL

  // 1. Динамическая загрузка скрипта при согласии
  useEffect(() => {
    if (consent === 'accepted') {
      loadYandexMetrika()
    }
  }, [consent])

  // 2. Трекинг переходов по страницам (Событие 'hit')
  useEffect(() => {
    const win = window as any
    
    // Отправляем хит, только если куки приняты, скрипт загружен и ID валидный
    if (consent === 'accepted' && win.ym && YANDEX_COUNTER_ID) {
      const currentUrl = win.location.href

      win.ym(YANDEX_COUNTER_ID, 'hit', currentUrl, {
        title: document.title,
        referer: document.referrer,
      })
    }
  }, [location, consent]) // Срабатывает при смене страницы или сразу после принятия кук

  return <>{children}</> // Теперь он оборачивает приложение, а не возвращает null