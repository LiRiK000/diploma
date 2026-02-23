import { orderService } from '@shared/services/Order'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

export const useOrderActions = () => {
  const queryClient = useQueryClient()

  const approveMutation = useMutation({
    mutationFn: (id: string) => orderService.approveOrder(id),
    onSuccess: () => {
      message.success('Заказ одобрен')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) => orderService.rejectOrder(id),
    onSuccess: () => {
      message.warning('Заказ отклонен')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  return {
    approve: approveMutation.mutate,
    isApproveLoading: approveMutation.isPending,
    reject: rejectMutation.mutate,
    isRejectLoading: rejectMutation.isPending,
  }
}
