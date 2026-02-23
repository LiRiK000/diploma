import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookService } from '@shared/services/BookService'
import { authorService } from '@shared/services/AuthorService'
import { genreService } from '@shared/services/GenreService'
import type { BookDto } from '@shared/services/Book/types'
import type { UpsertBookPayload } from '@shared/services/BookService/BookService'
import { message } from 'antd'

const KEYS = {
  books: ['librarian-books'],
  authors: ['librarian-authors'],
  genres: ['librarian-genres'],
} as const

export const useLibrarianBooks = () => {
  const queryClient = useQueryClient()

  const booksQuery = useQuery({
    queryKey: KEYS.books,
    queryFn: async () => {
      const paginated = await bookService.getPaginated(null, 50)
      return paginated.items as BookDto[]
    },
  })

  const authorsQuery = useQuery({
    queryKey: KEYS.authors,
    queryFn: () => authorService.getAll(),
  })

  const genresQuery = useQuery({
    queryKey: KEYS.genres,
    queryFn: () => genreService.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bookService.delete(id),
    onSuccess: () => {
      message.success('Книга удалена')
      queryClient.invalidateQueries({ queryKey: KEYS.books })
    },
  })

  const upsertMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
      file,
    }: {
      id?: string
      payload: UpsertBookPayload
      file?: File
    }) => {
      const book = id
        ? await bookService.update(id, payload)
        : await bookService.create(payload)

      if (file) {
        const fd = new FormData()
        fd.append('file', file)
        await bookService.uploadCover(book.id, fd)
      }
      return book
    },
    onSuccess: () => {
      message.success('Данные сохранены')
      queryClient.invalidateQueries({ queryKey: KEYS.books })
    },
    onError: () => message.error('Ошибка при сохранении книги'),
  })

  return {
    books: booksQuery.data ?? [],
    authors: authorsQuery.data ?? [],
    genres: genresQuery.data ?? [],
    isLoading: booksQuery.isLoading,
    isUpserting: upsertMutation.isPending,
    deleteBook: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    upsertBook: upsertMutation.mutateAsync,
  }
}
