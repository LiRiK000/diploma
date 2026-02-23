import { Button, message } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '@shared/services/Order'

export const ConfirmReceiptButton = ({ orderId }: { orderId: string }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => orderService.confirmReceipt(orderId),
    onSuccess: () => {
      message.success('Книги успешно получены!')
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    },
    onError: () => {
      message.error('Ошибка подтверждения')
    },
  })

  return (
    <Button
      type="primary"
      size="large"
      loading={isPending}
      onClick={() => mutate()}
    >
      Я получил книги
    </Button>
  )
}
