import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usersAdminService } from '@shared/services/UsersAdmin'

const USERS_QUERY_KEY = ['users', 'admin'] as const

export const useManagedUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => usersAdminService.getAll(),
  })
}

export const useUserModerationActions = () => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
  }

  const blacklist = useMutation({
    mutationFn: ({
      userId,
      banReason,
    }: {
      userId: string
      banReason: string
    }) => usersAdminService.blacklist(userId, { banReason }),
    onSuccess: invalidate,
  })

  const suspend = useMutation({
    mutationFn: ({
      userId,
      suspendedUntil,
      banReason,
    }: {
      userId: string
      suspendedUntil: string
      banReason: string
    }) => usersAdminService.suspend(userId, { suspendedUntil, banReason }),
    onSuccess: invalidate,
  })

  const unblock = useMutation({
    mutationFn: (userId: string) => usersAdminService.unblock(userId),
    onSuccess: invalidate,
  })

  return { blacklist, suspend, unblock }
}
