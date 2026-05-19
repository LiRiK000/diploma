import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardKeys } from './useDashboard'
import { dashboardService } from '@shared/services/WidgetsService/WidgetsService'
/**
 * Хук для удаления виджета с конваса дашборда
 */
export const useRemoveWidget = (dashboardKey: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (widgetId: string) => dashboardService.removeWidget(widgetId),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: dashboardKeys.detail(dashboardKey),
      })
    },
  })
}
