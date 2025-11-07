import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { booksApi } from '@shared/services/BookService/BookService'

export const useBooks = () => {
  const loadMoreRef = useRef(null)
  const query = useInfiniteQuery({
    queryKey: ['books'],
    queryFn: ({ pageParam }) => booksApi.getPaginated(pageParam),
    getNextPageParam: lastPage => lastPage.nextCursor || undefined,
    initialPageParam: null as string | null,
  })
  const { hasNextPage, fetchNextPage } = query
  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) fetchNextPage()
    })
    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])
  const books = query.data?.pages.flatMap(page => page.items) ?? []

  return { ...query, books, loadMoreRef }
}
