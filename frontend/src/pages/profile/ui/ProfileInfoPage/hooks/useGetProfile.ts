import type { UserProfile } from '@shared/services/User/types'
import { userService } from '@shared/services/User'
import { useQuery } from '@tanstack/react-query'

export const useGetProfile = () => {
  const { data, isLoading } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: () => userService.getMe(),
  })

  return { data, isLoading }
}
