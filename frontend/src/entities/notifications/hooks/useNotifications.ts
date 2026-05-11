import { notificationService } from '@shared/services/NotificationService'
import { QueryNotificationsDto } from '@shared/services/NotificationService/model/types'
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'

const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  list: (dto?: QueryNotificationsDto) =>
    ['notifications', 'list', dto] as const,
  unread: ['notifications', 'unread-count'] as const,
}

export const useNotifications = (queryDto?: QueryNotificationsDto) => {
  const queryClient = useQueryClient()

  const notificationsQuery = useInfiniteQuery({
    queryKey: NOTIFICATION_KEYS.list(queryDto),
    queryFn: ({ pageParam }) =>
      notificationService.findMine({
        ...queryDto,
        cursor: pageParam as string | undefined,
        take: queryDto?.take ?? 15,
      }),
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
  })

  const notifications =
    notificationsQuery.data?.pages.flatMap(page => page.items) ?? []

  const unreadCountQuery = useQuery({
    queryKey: NOTIFICATION_KEYS.unread,
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 60000,
    select: (data: any) => {
      if (data && typeof data === 'object' && 'count' in data) {
        return data.count
      }
      return typeof data === 'number' ? data : 0
    },
  })
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all })
  }

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: invalidateAll,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: invalidateAll,
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => notificationService.remove(id),
    onSuccess: invalidateAll,
  })

  return {
    notifications,
    unreadCount: unreadCountQuery.data ?? 0,
    total: notificationsQuery.data?.pages[0]?.total ?? 0,

    isLoading: notificationsQuery.isLoading,
    isFetchingNextPage: notificationsQuery.isFetchingNextPage,
    hasNextPage: notificationsQuery.hasNextPage,

    fetchNextPage: notificationsQuery.fetchNextPage,
    markAllRead: markAllReadMutation.mutate,
    markRead: markReadMutation.mutate,
    remove: removeMutation.mutate,

    isMarkingAllLoading: markAllReadMutation.isPending,
    isMarkingReadLoading: markReadMutation.isPending,
  }
}
