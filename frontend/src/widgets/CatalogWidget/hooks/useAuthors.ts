import { useQuery } from '@tanstack/react-query'
import { authorService } from '@shared/services/AuthorService'

export const useAuthors = () => {
  return useQuery({
    queryKey: ['authors'],
    queryFn: () => authorService.getAll(),
  })
}
