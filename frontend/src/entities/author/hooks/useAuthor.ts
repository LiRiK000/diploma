import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { authorService } from '@shared/services/AuthorService'

export const useAuthor = () => {
  const { id } = useParams()
  const {
    data: author,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['author', id],
    queryFn: () => authorService.getById(id!),
  })

  return { author, isLoading, isError }
}
