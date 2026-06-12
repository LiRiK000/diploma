import { authService } from '@shared/services/Auth'
import { MeResponse } from '@shared/services/Auth/types'
import { useQuery } from '@tanstack/react-query'

export const useGetMe = () => {
  return useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
    retry: false,
  })
}
