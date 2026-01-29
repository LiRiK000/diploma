import { authorService } from '@shared/services/AuthorService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
export const useAuthorMutation = (authorId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authorService.toggleFollow(authorId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['author', authorId] })

      const previousAuthor = queryClient.getQueryData(['author', authorId])

      queryClient.setQueryData(['author', authorId], (old: any) => {
        if (!old) return old

        const isCurrentlyFollowing = old.isFollowing

        return {
          ...old,
          isFollowing: !isCurrentlyFollowing,
          followersCount: isCurrentlyFollowing
            ? old.followersCount - 1
            : old.followersCount + 1,
        }
      })

      return { previousAuthor }
    },

    onError: (err, variables, context) => {
      if (context?.previousAuthor) {
        queryClient.setQueryData(['author', authorId], context.previousAuthor)
      }
      message.error('Не удалось обновить подписку')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['author', authorId] })
      queryClient.invalidateQueries({ queryKey: ['authors'] })
    },
  })
}
