import type { PropsWithChildren } from 'react'
import { useOnlineStatus, usePWAInstall, usePWAUpdate } from '@shared/hooks'
import { InstallBanner } from '@shared/ui/InstallBanner'
import { OfflinePage } from '@shared/ui/OfflinePage'
import { UpdateBanner } from '@shared/ui/UpdateBanner'

export const PWAProvider = ({ children }: PropsWithChildren) => {
  const { isOnline, retry } = useOnlineStatus()
  const { isInstallable, install, dismiss: dismissInstall } = usePWAInstall()
  const { needRefresh, update, dismiss: dismissUpdate } = usePWAUpdate()

  return (
    <>
      {children}

      {!isOnline && <OfflinePage onRetry={retry} />}

      {isInstallable && (
        <InstallBanner onInstall={install} onDismiss={dismissInstall} />
      )}

      {needRefresh && (
        <UpdateBanner onUpdate={update} onDismiss={dismissUpdate} />
      )}
    </>
  )
}
