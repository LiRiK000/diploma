import { CartService } from '@shared/services/Cart'
import { useQuery } from '@tanstack/react-query'

export const useCartTotal = () => {
  return useQuery({
    queryKey: ['cart', 'total'],
    queryFn: CartService.getTotalCart,
    staleTime: 1000 * 60,
  })
}
