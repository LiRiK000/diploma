import { BookDto } from '@shared/services/Book/types'

export type BookCardView = Pick<
  BookDto,
  'id' | 'title' | 'author' | 'coverUrl' | 'availableQuantity' | 'genre'
>
export interface BookCardProps {
  book: BookCardView
}
