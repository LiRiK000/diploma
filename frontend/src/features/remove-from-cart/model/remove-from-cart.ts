import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cartService } from '@shared/services/Cart'

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => cartService.removeFromCart(itemId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['cart', 'total'] })
    },
  })
}
