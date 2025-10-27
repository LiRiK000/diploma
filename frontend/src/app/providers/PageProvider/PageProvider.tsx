import { Suspense } from 'react'
import { AnalyticsProvider } from '../AnalyticsProvider/AnalyticsProvider'
import { Loader } from '@shared/components/Loader'
import { CookieBanner } from '@features/cookie'

export const PageProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<Loader />}>
      <AnalyticsProvider />
      <CookieBanner />
      {children}
    </Suspense>
  )
}
