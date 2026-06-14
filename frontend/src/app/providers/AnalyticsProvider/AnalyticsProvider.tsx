import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { loadYandexMetrika } from './utils'
import { YANDEX_COUNTER_ID } from './constants'
import { useCookieConsentStore } from '@features/cookie/model/store'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const consent = useCookieConsentStore(useShallow(state => state.consent))
  const location = useLocation()

  useEffect(() => {
    if (consent === 'accepted') {
      loadYandexMetrika()
    }
  }, [consent])

  useEffect(() => {
    const win = window as any

    if (consent === 'accepted' && win.ym && YANDEX_COUNTER_ID) {
      const currentUrl = win.location.href

      win.ym(YANDEX_COUNTER_ID, 'hit', currentUrl, {
        title: document.title,
        referer: document.referrer,
      })
    }
  }, [location, consent])

  return <>{children}</>
}
