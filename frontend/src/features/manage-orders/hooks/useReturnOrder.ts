import { ApiError } from '@shared/api/types'
import { orderService } from '@shared/services/Order'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

export const useReturnOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => orderService.returnOrder(orderId),
    onSuccess: () => {
      message.success('Книги успешно возвращены')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      queryClient.invalidateQueries({ queryKey: ['order'] })
    },
    onError: (error: ApiError) => {
      const errorMsg = error.message || 'Не удалось оформить возврат'
      message.error(errorMsg)
    },
  })
}
