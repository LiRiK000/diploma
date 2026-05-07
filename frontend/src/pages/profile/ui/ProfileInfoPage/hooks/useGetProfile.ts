import { MeResponse } from '@shared/services/Auth/types'
import { userService } from '@shared/services/User'
import { useQuery } from '@tanstack/react-query'

export const useGetProfile = () => {
  const { data, isLoading } = useQuery<MeResponse>({
    queryKey: ['profile'],
    queryFn: () => userService.getMe(),
  })

  return { data, isLoading }
}
