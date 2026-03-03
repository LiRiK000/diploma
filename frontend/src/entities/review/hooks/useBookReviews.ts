import { bookService } from '@shared/services/BookService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IReviewCard } from './model/types'

export const useBookReviews = (bookId: string) => {
  const queryClient = useQueryClient()

  const { data: reviews, isLoading } = useQuery<IReviewCard[]>({
    queryKey: ['reviews', bookId],
    queryFn: () => bookService.getReviews(bookId),
  })

  const { mutate: createReview, isPending: isCreating } = useMutation({
    mutationFn: (text: string) => bookService.addReview(bookId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', bookId] })
    },
    onError: error => {
      console.error(error)
    },
  })

  return {
    reviews,
    isLoading,
    createReview,
    isCreating,
  }
}
