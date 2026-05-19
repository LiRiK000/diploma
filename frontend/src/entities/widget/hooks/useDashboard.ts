import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardService } from '@shared/services/WidgetsService/WidgetsService'
import { UpdateDashboardLayoutPayload } from '../types'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  detail: (key: string) => [...dashboardKeys.all, key] as const,
}

/**
 * Хук для получения конфигурации дашборда
 */
export const useDashboard = (key: string) => {
  return useQuery({
    queryKey: dashboardKeys.detail(key),
    queryKeyHashFn: undefined,
    queryFn: () => dashboardService.getByKey(key),
    enabled: Boolean(key),
  })
}

/**
 * Хук для сохранения сетки виджетов
 */
export const useUpdateDashboardLayout = (key: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateDashboardLayoutPayload) =>
      dashboardService.updateLayout(payload),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: dashboardKeys.detail(key),
      })
    },
  })
}

/**
 * Хук для включения/выключения виджета
 */
export const useToggleWidget = (key: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (widgetId: string) => dashboardService.toggleWidget(widgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.detail(key) })
    },
  })
}
