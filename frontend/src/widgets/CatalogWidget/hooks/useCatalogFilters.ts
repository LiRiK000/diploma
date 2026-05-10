import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

export const useCatalogFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(
    () => ({
      page: Number(searchParams.get('page')) || 1,
      limit: 12,
      genreId: searchParams.get('genreId') || undefined,
      authorId: searchParams.get('authorId') || undefined,
      collection: searchParams.get('collection') || undefined,
      sort: searchParams.get('sort') || 'newest',
      search: searchParams.get('search') || '',
    }),
    [searchParams],
  )

  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev)

        Object.entries(newFilters).forEach(([key, value]) => {
          if (value === undefined || value === '' || value === null) {
            next.delete(key)
          } else {
            next.set(key, String(value))
          }
        })

        if (!newFilters.hasOwnProperty('page')) {
          next.set('page', '1')
        }

        return next
      })
    },
    [setSearchParams],
  )

  return { filters, updateFilters }
}
