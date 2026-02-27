import { useSearchParams } from 'react-router-dom'
import {
  GetCatalogParams,
  CatalogSort,
} from '@shared/services/Catalog/catalog.types'

export const useCatalogFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: GetCatalogParams = {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 12,
    genreId: searchParams.get('genreId') || undefined,
    authorId: searchParams.get('authorId') || undefined,
    search: searchParams.get('search') || '',
    sort: (searchParams.get('sort') as CatalogSort) || 'newest',
  }

  const updateFilters = (partialFilters: Partial<GetCatalogParams>) => {
    const newFilters = { ...filters, ...partialFilters }

    if (partialFilters.page === undefined) {
      newFilters.page = 1
    }

    const params: Record<string, string> = {}
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params[key] = String(value)
      }
    })

    setSearchParams(params)
  }

  return { filters, updateFilters }
}
