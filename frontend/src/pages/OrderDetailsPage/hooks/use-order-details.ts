import { orderService } from '@shared/services/Order'
import { useQuery } from '@tanstack/react-query'

export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5,
  })
}
