import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { orderService } from '@shared/services/Order'
import { OrderResponse, OrderStatus } from '@shared/services/Order/types'
import { AxiosError } from 'axios'
export const useOrder = (id: string | undefined) => {
  const queryClient = useQueryClient()

  const orderQuery = useQuery<OrderResponse, AxiosError<{ message: string }>>({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id!),
    enabled: !!id,
    refetchInterval: query => {
      const status = query.state.data?.status
      const finalStatuses = [
        OrderStatus.ON_HAND,
        OrderStatus.CANCELLED,
        OrderStatus.RETURNED,
      ]
      return finalStatuses.includes(status as any) ? false : 5000
    },
  })

  const confirmMutation = useMutation({
    mutationFn: () => orderService.confirmReceipt(id!),
    onSuccess: () => {
      message.success('Книги успешно получены!')
      queryClient.invalidateQueries({ queryKey: ['order', id] })
    },
    onError: (err: any) =>
      message.error(err.response?.data?.message || 'Ошибка'),
  })

  const cancelMutation = useMutation({
    mutationFn: () => orderService.cancelOrder(id!),
    onSuccess: () => {
      message.success('Заказ отменен')
      queryClient.invalidateQueries({ queryKey: ['order', id] })
    },
    onError: (err: any) =>
      message.error(err.response?.data?.message || 'Ошибка'),
  })

  return {
    order: orderQuery.data,
    isLoading: orderQuery.isLoading,
    confirmReceipt: confirmMutation.mutate,
    isConfirming: confirmMutation.isPending,
    cancelOrder: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
  }
}
