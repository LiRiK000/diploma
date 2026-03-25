import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  authorService,
  type UpsertAuthorPayload,
} from '@shared/services/AuthorService'
import { message } from 'antd'
import { AxiosError } from 'axios'

const KEYS = {
  authors: ['librarian-authors'],
} as const

export const useLibrarianAuthors = () => {
  const queryClient = useQueryClient()

  const authorsQuery = useQuery({
    queryKey: KEYS.authors,
    queryFn: () => authorService.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => authorService.delete(id),
    onSuccess: () => {
      message.success('Автор удален')
      queryClient.invalidateQueries({ queryKey: KEYS.authors })
    },
  })

  const upsertMutation = useMutation({
    mutationFn: ({
      id,
      payload,
      file,
    }: {
      id?: string
      payload: UpsertAuthorPayload
      file?: File
    }) =>
      id
        ? authorService.update(id, payload, file)
        : authorService.create(payload, file),
    onSuccess: () => {
      message.success('Данные сохранены')
      queryClient.invalidateQueries({ queryKey: KEYS.authors })
    },
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.message || 'Ошибка при сохранении')
    },
  })

  return {
    authors: authorsQuery.data ?? [],
    isLoading: authorsQuery.isLoading,
    isUpserting: upsertMutation.isPending,
    upsertAuthor: upsertMutation.mutateAsync,
    deleteAuthor: deleteMutation.mutate,
  }
}
