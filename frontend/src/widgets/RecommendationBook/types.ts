import { BookDto } from '@shared/services/Book/types'

export interface RecommendationBookProps {
  books: Pick<BookDto, 'id' | 'title' | 'author' | 'availableQuantity'>[]
}
