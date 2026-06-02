import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { orderService } from '@shared/services/Order'
import { OrderResponse } from '../types'

export const useOrderManagement = (orderId?: string) => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['orders-all'] })
    queryClient.invalidateQueries({ queryKey: ['orders'] })
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    if (orderId) {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    }
  }

  const approveMutation = useMutation({
    mutationFn: (id: string) => orderService.approveOrder(id),
    onSuccess: () => {
      message.success('Заказ успешно одобрен')
      invalidate()
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) => orderService.rejectOrder(id),
    onSuccess: () => {
      message.error('Заказ отклонен')
      invalidate()
    },
  })

  const verifyCodeMutation = useMutation<OrderResponse, Error, string>({
    mutationFn: (pickupCode: string) =>
      orderService.verifyPickupCode(pickupCode),
    onSuccess: data => {
      message.success(`Книги выданы (Заказ #${data.id.slice(0, 6)})`)
      invalidate()
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Неверный код выдачи'
      message.error(msg)
    },
  })

  const returnMutation = useMutation({
    mutationFn: (id: string) => orderService.returnOrder(id),
    onSuccess: () => {
      message.success('Все оставшиеся книги возвращены в библиотеку')
      invalidate()
    },
  })

  // --- НОВАЯ МУТАЦИЯ ДЛЯ ЧАСТИЧНОГО ВОЗВРАТА ---
  const returnItemMutation = useMutation({
    mutationFn: (orderItemId: string) =>
      orderService.returnOrderItem(orderItemId),
    onSuccess: () => {
      message.success('Книга успешно возвращена')
      invalidate()
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Не удалось вернуть книгу'
      message.error(msg)
    },
  })

  return {
    approve: approveMutation.mutate,
    isApproving: approveMutation.isPending,
    reject: rejectMutation.mutate,
    isRejecting: rejectMutation.isPending,
    verifyCode: verifyCodeMutation.mutate,
    isVerifying: verifyCodeMutation.isPending,
    returnOrder: returnMutation.mutate,
    isReturning: returnMutation.isPending,

    // Экспортируем новые свойства
    returnOrderItem: returnItemMutation.mutate,
    isReturningItem: returnItemMutation.isPending,
  }
}
