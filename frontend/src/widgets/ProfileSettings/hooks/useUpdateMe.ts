import { userService } from '@shared/services/User'
import { openNotification } from '@shared/utils/openNotification'
import type { UpdateMePayload } from '@shared/services/User/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateMe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateMePayload) => {
      const response = await userService.updateMe(payload)
      return response.data.user
    },
    onSuccess: async () => {
      openNotification('Данные профиля обновлены', 'success')
      await queryClient.invalidateQueries({ queryKey: ['user-me'] })
      await queryClient.invalidateQueries({ queryKey: ['me'] })
    },
    onError: () => {
      openNotification('Не удалось обновить данные профиля', 'error')
    },
  })
}
