import { bookService } from '@shared/services/BookService'
import { useQuery } from '@tanstack/react-query'

export const useBookSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['book-suggestions', query],
    queryFn: async () => {
      const data = await bookService.getSuggestions(query)
      console.log('Suggestions from service:', data)
      return data
    },
    enabled: query.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  })
}
