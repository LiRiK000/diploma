import { CartService } from '@shared/services/Cart'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookId: string) => CartService.addToCart(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['cart', 'total'] })
    },
  })
}
