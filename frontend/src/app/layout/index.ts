import { lazy } from 'react'

export const MainLayout = lazy(() =>
  import('./MainLayout').then(module => ({ default: module.MainLayout })),
)
