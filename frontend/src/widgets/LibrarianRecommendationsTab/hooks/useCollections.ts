import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { bookService } from '@shared/services/BookService'
import { UpsertCollectionPayload } from '@shared/services/BookService/BookService'

export const useCollections = (collectionId?: string) => {
  const queryClient = useQueryClient()

  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: () => bookService.getAllCollections(),
  })

  const { data: currentCollection, isLoading: isCollectionLoading } = useQuery({
    queryKey: ['collections', collectionId],
    queryFn: () => bookService.getCollectionById(collectionId!),
    enabled: !!collectionId,
  })

  const createMutation = useMutation({
    mutationFn: (payload: UpsertCollectionPayload) =>
      bookService.createCollection(payload),
    onSuccess: () => {
      void message.success('Коллекция создана')
      void queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
    onError: () => {
      void message.error('Ошибка при создании')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpsertCollectionPayload
    }) => bookService.updateCollection(id, payload),
    onSuccess: () => {
      void message.success('Коллекция обновлена')
      void queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
    onError: () => {
      void message.error('Ошибка при обновлении')
    },
  })

  // 5. Удаление коллекции
  const deleteMutation = useMutation({
    mutationFn: (id: string) => bookService.deleteCollection(id),
    onSuccess: () => {
      void message.success('Коллекция удалена')
      void queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
    onError: () => {
      void message.error('Не удалось удалить коллекцию')
    },
  })

  return {
    collections,
    currentCollection,
    isLoading: isLoading || (!!collectionId && isCollectionLoading),
    createCollection: createMutation.mutateAsync,
    updateCollection: updateMutation.mutateAsync,
    deleteCollection: deleteMutation.mutateAsync,
    isProcessing:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  }
}
