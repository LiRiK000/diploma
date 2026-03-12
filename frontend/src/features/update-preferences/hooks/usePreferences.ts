import { Author, authorService } from '@shared/services/AuthorService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useCallback, useMemo } from 'react'

export const usePreferenceAuthors = (initialLimit = 12) => {
  const queryClient = useQueryClient()
  const [displayAuthors, setDisplayAuthors] = useState<Author[]>([])
  const [pool, setPool] = useState<Author[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const excludeIds = useMemo(
    () => [...displayAuthors.map(a => a.id), ...pool.map(a => a.id)],
    [displayAuthors, pool],
  )

  const { isFetching, refetch } = useQuery({
    queryKey: ['authors-pool', excludeIds.length],
    queryFn: () => authorService.getAll({ excludeIds, limit: 10 }),
    enabled: false,
  })

  useEffect(() => {
    let isMounted = true

    authorService
      .getAll({ limit: initialLimit + 10 })
      .then(data => {
        if (!isMounted) return

        const uniqueById = Array.from(
          new Map(data.map(author => [author.id, author])).values(),
        )

        setDisplayAuthors(uniqueById.slice(0, initialLimit))
        setPool(uniqueById.slice(initialLimit))
      })
      .finally(() => {
        if (isMounted) {
          setIsInitialLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [initialLimit])

  useEffect(() => {
    if (!hasMore || pool.length >= 5 || isFetching) return

    refetch().then(({ data }) => {
      if (!data) {
        setHasMore(false)
        return
      }

      setPool(prev => {
        const existingIds = new Set([
          ...prev.map(a => a.id),
          ...displayAuthors.map(a => a.id),
        ])
        const fresh = data.filter(author => !existingIds.has(author.id))

        if (fresh.length === 0) {
          setHasMore(false)
          return prev
        }

        return [...prev, ...fresh]
      })
    })
  }, [pool.length, isFetching, refetch, displayAuthors, hasMore])

  const popFromPool = useCallback(() => {
    if (pool.length > 0) {
      const [next, ...rest] = pool
      setPool(rest)
      setDisplayAuthors(prev => [...prev, next])
    }
  }, [pool])

  const { mutate: submit, isPending: isSubmitting } = useMutation({
    mutationFn: (ids: string[]) => authorService.bulkFollow(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-me'] })
      queryClient.invalidateQueries({ queryKey: ['authors'] })
    },
  })

  return {
    displayAuthors,
    popFromPool,
    isLoading: isInitialLoading,
    isSubmitting,
    submit,
  }
}
