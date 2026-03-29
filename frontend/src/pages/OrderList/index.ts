import { lazy } from 'react'

export const OrderList = lazy(() =>
  import('./OrderList').then(module => ({ default: module.OrderList })),
)
