import { useEffect } from 'react'
import { loadYandexMetrika } from './utils'
import { useCookieConsentStore } from '@features/cookie/model/store'
import { useShallow } from 'zustand/react/shallow'

export function AnalyticsProvider() {
  const consent = useCookieConsentStore(useShallow(state => state.consent))

  useEffect(() => {
    if (consent === 'accepted') {
      loadYandexMetrika()
    }
  }, [consent])

  return null
}
