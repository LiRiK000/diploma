import { lazy } from 'react'

export const BookPage = lazy(() =>
  import('./BookPage').then(module => ({ default: module.BookPage })),
)
