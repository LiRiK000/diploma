import { ApiError } from '@shared/api/types'
import { orderService } from '@shared/services/Order'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

export const useReturnOrder = () => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] })
    queryClient.invalidateQueries({ queryKey: ['orders-all'] })
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    queryClient.invalidateQueries({ queryKey: ['order'] })
  }

  const returnOrderMutation = useMutation({
    mutationFn: (code: string) => orderService.returnOrderByCode(code),
    onSuccess: () => {
      message.success('Заказ успешно закрыт (все книги возвращены)')
      invalidate()
    },
    onError: (error: ApiError) => {
      message.error(error.message || 'Не удалось оформить возврат заказа')
    },
  })

  // Мутация для поштучного возврата через код на главной панели
  const returnItemByCodeMutation = useMutation({
    mutationFn: ({ code, bookId }: { code: string; bookId: string }) =>
      orderService.returnOrderItemByCode(code, bookId),
    onSuccess: () => {
      message.success('Книга успешно возвращена в библиотеку')
      invalidate()
    },
    onError: (error: ApiError) => {
      message.error(error.message || 'Не удалось оформить возврат книги')
    },
  })

  return {
    returnOrder: returnOrderMutation.mutate,
    isPending: returnOrderMutation.isPending,

    returnItemByCode: returnItemByCodeMutation.mutate,
    isItemPending: returnItemByCodeMutation.isPending,
  }
}
