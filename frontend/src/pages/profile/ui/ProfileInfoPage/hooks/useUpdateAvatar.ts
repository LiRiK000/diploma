// @widgets/ProfileSettings/hooks/useUpdateAvatar.ts
import { userService } from '@shared/services/User'
import { openNotification } from '@shared/utils/openNotification'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: data => {
      openNotification('Аватар обновлен', 'success')
      queryClient.invalidateQueries({ queryKey: ['user-me'] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
    onError: () => {
      openNotification('Не удалось загрузить фото', 'error')
    },
  })
}
