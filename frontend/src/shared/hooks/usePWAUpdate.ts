import { useCallback } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export interface UsePWAUpdateResult {
  needRefresh: boolean
  update: () => Promise<void>
  dismiss: () => void
}

export const usePWAUpdate = (): UsePWAUpdateResult => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegistered(registration) {
      if (!registration) {
        return
      }

      registration.update()
    },
    onRegisterError(error) {
      console.error('Service Worker registration failed:', error)
    },
  })

  const update = useCallback(async () => {
    await updateServiceWorker(true)
  }, [updateServiceWorker])

  const dismiss = useCallback(() => {
    setNeedRefresh(false)
  }, [setNeedRefresh])

  return {
    needRefresh,
    update,
    dismiss,
  }
}
