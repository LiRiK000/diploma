import { lazy } from 'react'

export const AuthorPage = lazy(() =>
  import('./AuthorPage').then(module => ({ default: module.AuthorPage })),
)
