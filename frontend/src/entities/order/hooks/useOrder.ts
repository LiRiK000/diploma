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
      return status === OrderStatus.ON_HAND || status === OrderStatus.CANCELLED
        ? false
        : 5000
    },
  })

  const confirmMutation = useMutation<
    OrderResponse,
    AxiosError<{ message: string }>,
    void
  >({
    mutationFn: () => orderService.confirmReceipt(id!),
    onSuccess: () => {
      message.success('Книги успешно получены!')
      queryClient.invalidateQueries({ queryKey: ['order', id] })
    },
    onError: error => {
      message.error(error.response?.data?.message || 'Ошибка подтверждения')
    },
  })

  const cancelMutation = useMutation<
    OrderResponse,
    AxiosError<{ message: string }>,
    void
  >({
    mutationFn: () => orderService.cancelOrder(id!),
    onSuccess: () => {
      message.success('Заказ отменен')
      queryClient.invalidateQueries({ queryKey: ['order', id] })
    },
    onError: error => {
      message.error(
        error.response?.data?.message || 'Не удалось отменить заказ',
      )
    },
  })

  return {
    order: orderQuery.data,
    isLoading: orderQuery.isLoading,
    isError: orderQuery.isError,
    confirmReceipt: confirmMutation.mutate,
    isConfirming: confirmMutation.isPending,
    cancelOrder: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
  }
}
