import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { orderService } from '@shared/services/Order'
import { OrderResponse } from '@shared/services/Order/types'
import { AxiosError } from 'axios'

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation<OrderResponse, AxiosError<{ message: string }>, void>({
    mutationFn: () => orderService.checkout(),
    onSuccess: data => {
      message.success('Заказ успешно оформлен!')
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      navigate(`/order/${data.id}`)
    },
    onError: error => {
      const errorMessage =
        error.response?.data?.message || 'Ошибка при оформлении'
      message.error(errorMessage)
    },
  })
}
