import { useQuery } from '@tanstack/react-query'
import { bookService } from '@shared/services/BookService'

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => bookService.getFavorites(),
  })
}
