import { routes } from '@shared/constants'
import { authService } from '@shared/services/Auth'
import { openNotification } from '@shared/utils/openNotification'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      queryClient.clear()
      openNotification('Вы успешно вышли из системы', 'success')
      navigate(routes.login, { replace: true })
    },
    onError: () => {
      queryClient.clear()
      navigate(routes.login, { replace: true })
    },
  })

  return { logout, isPending }
}
