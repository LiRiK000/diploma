import { userService } from '@shared/services/User'
import { openNotification } from '@shared/utils/openNotification'
import type { UpdateMePayload } from '@shared/services/User/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateMe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateMePayload) => {
      const data = await userService.updateMe(payload)
      return data
    },
    onSuccess: async () => {
      openNotification('Данные профиля обновлены', 'success')
      await queryClient.invalidateQueries({ queryKey: ['user-me'] })
      await queryClient.invalidateQueries({ queryKey: ['me'] })
    },
    onError: (error: unknown) => {
      console.error('Update profile error:', error)
      openNotification('Не удалось обновить данные профиля', 'error')
    },
  })
}
