import { authService } from '@shared/services/Auth'
import { RegisterRequestData } from '@shared/services/Auth/types'
import { openNotification } from '@shared/utils/openNotification'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { routes } from '@shared/constants'

export const useRegister = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate: register, isPending } = useMutation({
    mutationFn: async (values: RegisterRequestData) => {
      return await authService.register(values)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] })
      openNotification('Регистрация прошла успешно', 'success')
      setTimeout(() => {
        navigate(routes.home)
      }, 1000)
    },
    onError: () => {
      openNotification(
        'При регистрации произошла ошибка, попробуйте позже',
        'error',
      )
    },
  })

  return { register, isPending }
}
