import { useCallback, useEffect, useState } from 'react'

export interface UseOnlineStatusResult {
  isOnline: boolean
  retry: () => void
}

export const useOnlineStatus = (): UseOnlineStatusResult => {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine,
  )

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const retry = useCallback(() => {
    window.location.reload()
  }, [])

  return {
    isOnline,
    retry,
  }
}
