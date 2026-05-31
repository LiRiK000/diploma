import { cartService } from '@shared/services/Cart'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookId: string) => cartService.addToCart(bookId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cart'] })
      void queryClient.invalidateQueries({ queryKey: ['cart', 'total'] })
    },
  })
}
