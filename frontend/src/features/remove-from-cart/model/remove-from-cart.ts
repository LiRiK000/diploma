import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CartService } from '@shared/services/Cart'

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => CartService.removeFromCart(itemId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['cart', 'total'] })
    },
  })
}
