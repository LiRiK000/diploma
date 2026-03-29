import { lazy } from 'react'

export const CatalogPage = lazy(() =>
  import('./Catalog').then(module => ({ default: module.CatalogPage })),
)
