import { bookService } from '@shared/services/BookService'
import { useQuery } from '@tanstack/react-query'

export const useBookSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['book-suggestions', query],
    queryFn: () => {
      return bookService.getSuggestions(query)
    },
    enabled: query.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  })
}
