import { authService } from '@shared/services/Auth'
import { MeResponse } from '@shared/services/Auth/types'
import { useQuery } from '@tanstack/react-query'

export const useGetMe = () => {
  const { data, isLoading } = useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
  })

  return { data, isLoading }
}
