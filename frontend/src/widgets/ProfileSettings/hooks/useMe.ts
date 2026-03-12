import { userService } from '@shared/services/User'
import { useQuery } from '@tanstack/react-query'

export const useMe = () => {
  return useQuery({
    queryKey: ['user-me'],
    queryFn: async () => {
      const response = await userService.getMe()
      return response.data.user
    },
  })
}
