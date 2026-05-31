import { cartService } from '@shared/services/Cart'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => cartService.removeFromCart(itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cart'] })
      void queryClient.invalidateQueries({ queryKey: ['cart', 'total'] })
    },
  })
}
