import { useQuery } from '@tanstack/react-query'
import { orderService } from '@shared/services/Order'
import { OrderResponse } from '@shared/services/Order/types'

export const useOrders = () => {
  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useQuery<OrderResponse[]>({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders(),
    select: data =>
      [...data].sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
      ),
  })

  return {
    orders,
    isLoading,
    isEmpty: !isLoading && (!orders || orders.length === 0),
    error,
    refetch,
  }
}
