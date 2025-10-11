import { authService } from '@shared/services/Auth'
import { RegisterRequestData } from '@shared/services/Auth/types'
import { openNotification } from '@shared/utils'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export const useRegister = () => {
  const navigate = useNavigate()
  const { mutate: register } = useMutation({
    mutationFn: async (values: RegisterRequestData) => {
      await authService.register(values)
    },
    onSuccess: () => {
      openNotification('Регистрация прошла успешно', 'success')
      setTimeout(() => {
        navigate(-1)
      }, 1000)
    },
    onError: () => {
      openNotification(
        'При регистрации произошла ошибка, попробуйте позже',
        'error',
      )
    },
  })

  return { register }
}
