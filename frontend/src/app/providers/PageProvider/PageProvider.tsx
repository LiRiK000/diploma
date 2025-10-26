import { Suspense } from 'react'
import { Loader } from '@shared/components/Loader'

export const PageProvider = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<Loader />}>{children}</Suspense>
}
