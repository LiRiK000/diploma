import { dashboardService } from '@shared/services/WidgetsService/WidgetsService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardKeys } from './useDashboard'
export const useAddWidgetToDashboard = (key: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      dashboardId: string
      key: string
      type: string
      title: string
      layout: {
        x: number
        y: number
        w: number
        h: number
        i: string
      }
    }) => dashboardService.createWidget(payload),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: dashboardKeys.detail(key),
      })
    },
  })
}
