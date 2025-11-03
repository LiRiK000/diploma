import { lazy } from 'react'

export const CartPage = lazy(() =>
  import('./CartPage').then(module => ({ default: module.CartPage })),
)
