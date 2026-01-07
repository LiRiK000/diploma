import { USER_ROLES } from '@entities/user/constants'
import { routes } from '@shared/constants'
import { authService } from '@shared/services/Auth'
import { LoginFormValues } from '@shared/services/Auth/types'
import { openNotification } from '@shared/utils/openNotification'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export const useLogin = () => {
  const navigate = useNavigate()
  const { mutate: login } = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      return await authService.login(values)
    },
    onSuccess: response => {
      openNotification('Вход в систему прошел успешно', 'success')
      setTimeout(() => {
        if (response?.data?.user?.role === USER_ROLES.LIBRARIAN) {
          navigate(routes.librarian)
        } else {
          navigate(routes.home)
        }
      }, 500)
    },
    onError: () => {
      openNotification('Вход в систему прошел не успешно', 'error')
    },
  })

  return { login }
}
