import { orderService } from '@shared/services/Order'
import { useQuery } from '@tanstack/react-query'

export const useLibrarianOrders = () => {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => orderService.getAllOrders(),
    refetchInterval: 30000,
  })
}
