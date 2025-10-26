import { lazy } from 'react'

export const ProfilePage = lazy(() =>
  import('./ProfilePage').then(module => ({ default: module.ProfilePage })),
)
