import { bookService } from '@shared/services/BookService'
import { useQuery } from '@tanstack/react-query'

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => {
      return bookService.searchBooks(query)
    },
    enabled: query.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  })
}
