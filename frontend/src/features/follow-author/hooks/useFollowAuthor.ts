import { authorService } from '@shared/services/AuthorService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
export const useAuthorMutation = (authorId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authorService.toggleFollow(authorId),

    onMutate: async () => {
      // 1. Отменяем текущие запросы, чтобы они не перезаписали оптимистичное состояние
      await queryClient.cancelQueries({ queryKey: ['author', authorId] })

      // 2. Сохраняем предыдущее состояние для отката при ошибке
      const previousAuthor = queryClient.getQueryData<any>(['author', authorId])

      // 3. Оптимистично обновляем кеш
      queryClient.setQueryData(['author', authorId], (old: any) => {
        if (!old) return old

        const isCurrentlyFollowing = old.isFollowing

        return {
          ...old,
          isFollowing: !isCurrentlyFollowing,
          // Теперь работаем с плоским полем followersCount
          followersCount: isCurrentlyFollowing
            ? old.followersCount - 1
            : old.followersCount + 1,
        }
      })

      return { previousAuthor }
    },

    // Если сервер вернул ошибку, откатываемся к сохраненному состоянию
    onError: (err, variables, context) => {
      if (context?.previousAuthor) {
        queryClient.setQueryData(['author', authorId], context.previousAuthor)
      }
      message.error('Не удалось обновить подписку')
    },

    // В любом случае синхронизируем данные с сервером после мутации
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['author', authorId] })
      queryClient.invalidateQueries({ queryKey: ['authors'] })
    },
  })
}
