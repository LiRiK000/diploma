import { bookService } from '@shared/services/BookService'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useToggleFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookId: string) => bookService.toggleFavorite(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
