import { useQuery } from '@tanstack/react-query'
import { cartService, CartService } from '@shared/services/Cart'
import { CartResponse } from '@shared/services/Cart/types'
export const useCart = () => {
  return useQuery<CartResponse, Error>({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    staleTime: 1000 * 30,
    placeholderData: {
      items: [],
      totalItems: 0,
      canAddMore: true,
    },
  })
}
