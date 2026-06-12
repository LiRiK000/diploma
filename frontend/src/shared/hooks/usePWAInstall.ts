import { useCallback, useEffect, useState } from 'react'
import {
  type BeforeInstallPromptEvent,
  isInstallDismissed,
  isInstallMarkedAsInstalled,
  isStandaloneDisplayMode,
  PWA_INSTALL_DISMISSED_KEY,
  PWA_INSTALL_INSTALLED_KEY,
} from './pwa.types'

export interface UsePWAInstallResult {
  isInstallable: boolean
  isInstalled: boolean
  install: () => Promise<void>
  dismiss: () => void
}

export const usePWAInstall = (): UsePWAInstallResult => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(
    () => isStandaloneDisplayMode() || isInstallMarkedAsInstalled(),
  )
  const [isDismissed, setIsDismissed] = useState(isInstallDismissed)

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      localStorage.setItem(PWA_INSTALL_INSTALLED_KEY, 'true')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      return
    }

    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice

    if (choice.outcome === 'accepted') {
      setIsInstalled(true)
      localStorage.setItem(PWA_INSTALL_INSTALLED_KEY, 'true')
    }

    setDeferredPrompt(null)
  }, [deferredPrompt])

  const dismiss = useCallback(() => {
    localStorage.setItem(PWA_INSTALL_DISMISSED_KEY, 'true')
    setIsDismissed(true)
    setDeferredPrompt(null)
  }, [])

  const isInstallable = Boolean(deferredPrompt) && !isInstalled && !isDismissed

  return {
    isInstallable,
    isInstalled,
    install,
    dismiss,
  }
}
