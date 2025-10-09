import { lazy } from 'react'

export const BookCard = lazy(() =>
  import('./BookCard').then(module => ({ default: module.BookCard })),
)
