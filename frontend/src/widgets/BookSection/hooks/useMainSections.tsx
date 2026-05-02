import { useQuery } from '@tanstack/react-query'
import { bookService } from '@shared/services/BookService'

export const useMainSections = () => {
  const query = useQuery({
    queryKey: ['book-main-sections'],
    queryFn: () => bookService.getMainSections(),
    staleTime: 5 * 60 * 1000,
  })

  return {
    ...query,
    sections: query.data ?? [],
  }
}
