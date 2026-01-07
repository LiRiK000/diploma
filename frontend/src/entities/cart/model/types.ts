import { BookCard } from '@pages/book/type'
export interface CartItem extends BookCard {
  bookId: string
  quantity: number
  genre: string
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  canAddMore: boolean
}
