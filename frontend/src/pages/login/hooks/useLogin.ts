import { authService } from '@shared/services/Auth'
import { LoginFormValues } from '@shared/services/Auth/types'
import { openNotification } from '@shared/utils'
import { useMutation } from '@tanstack/react-query'

export const useLogin = () => {
  const { mutate: login } = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      await authService.login(values)
    },
    onSuccess: () => {
      openNotification('Вход в систему прошел успешно', 'success')
    },
    onError: () => {
      openNotification('Вход в систему прошел не успешно', 'error')
    },
  })

  return { login }
}
