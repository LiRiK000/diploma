import { BookCardView } from '@entities/book/ui/BookCard/types'

export interface PaginatedBooksResponse {
  items: BookCardView[]
  nextCursor: string
}
