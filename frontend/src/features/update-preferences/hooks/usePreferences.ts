import { Author, authorService } from '@shared/services/AuthorService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useCallback, useMemo } from 'react'

export const usePreferenceAuthors = (initialLimit = 12) => {
  const queryClient = useQueryClient()
  const [displayAuthors, setDisplayAuthors] = useState<Author[]>([])
  const [pool, setPool] = useState<Author[]>([])

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
    authorService.getAll({ limit: initialLimit + 10 }).then(data => {
      setDisplayAuthors(data.slice(0, initialLimit))
      setPool(data.slice(initialLimit))
    })
  }, [initialLimit])

  useEffect(() => {
    if (pool.length < 5 && !isFetching) {
      refetch().then(({ data }) => {
        if (data) setPool(prev => [...prev, ...data])
      })
    }
  }, [pool.length, isFetching, refetch])

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
    isLoading: displayAuthors.length === 0 && isFetching,
    isSubmitting,
    submit,
  }
}
