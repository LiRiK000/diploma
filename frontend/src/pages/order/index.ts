import { lazy } from 'react'

export const OrderPage = lazy(() =>
  import('./OrderPage').then(module => ({ default: module.OrderPage })),
)
