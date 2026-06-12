export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export const PWA_INSTALL_DISMISSED_KEY = 'pwa-install-dismissed'
export const PWA_INSTALL_INSTALLED_KEY = 'pwa-installed'

export const isStandaloneDisplayMode = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true)
  )
}

export const isInstallDismissed = (): boolean => {
  return localStorage.getItem(PWA_INSTALL_DISMISSED_KEY) === 'true'
}

export const isInstallMarkedAsInstalled = (): boolean => {
  return localStorage.getItem(PWA_INSTALL_INSTALLED_KEY) === 'true'
}
