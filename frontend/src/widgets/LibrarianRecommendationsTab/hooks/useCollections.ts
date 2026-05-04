import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookService } from '@shared/services/BookService'
import { genreService } from '@shared/services/GenreService'
import { UpsertCollectionPayload } from '@shared/services/BookService/BookService'
import { useState, useEffect } from 'react'
import { message } from 'antd'

export const useCollections = (searchQuery = '') => {
  const queryClient = useQueryClient()
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
  const [messageApi, contextHolder] = message.useMessage()
  // Дебаунс для поиска книг (500мс)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500)
    return () => clearTimeout(handler)
  }, [searchQuery])

  // Загрузка всех коллекций для таблицы
  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: () => bookService.getAllCollections(),
  })

  // Загрузка жанров для выпадающего списка массового добавления
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: () => genreService.getAll(),
  })

  // Динамический поиск книг для селекта в модалке
  const { data: foundBooks, isFetching: isSearching } = useQuery({
    queryKey: ['admin-books-search', debouncedSearch],
    queryFn: () => bookService.getBooksForAdmin({ search: debouncedSearch }),
    enabled: debouncedSearch.length > 2,
  })

  const createMutation = useMutation({
    mutationFn: (payload: UpsertCollectionPayload) =>
      bookService.createCollection(payload),
    onSuccess: () => {
      messageApi.success('Коллекция успешно создана')
      void queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
    onError: () => messageApi.error('Ошибка при создании коллекции'),
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
      messageApi.success('Коллекция обновлена')
      void queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
    onError: () => messageApi.error('Ошибка при обновлении'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bookService.deleteCollection(id),
    onSuccess: () => {
      messageApi.success('Коллекция удалена')
      void queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })

  return {
    contextHolder,
    collections,
    genres,
    foundBooks: foundBooks || [],
    isSearching,
    isLoading,
    createCollection: createMutation.mutateAsync,
    updateCollection: updateMutation.mutateAsync,
    deleteCollection: deleteMutation.mutateAsync,
    isProcessing:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  }
}
