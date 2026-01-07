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

export interface CartItemResponse {
  id: string
  bookId: string
  title: string
  author: string
  coverUrl: string | null
  genre: string
  quantity: number
  available: number
}

export interface CartResponse {
  items: CartItemResponse[]
  totalItems: number
  canAddMore: boolean
}

export interface CartItemProps {
  item: CartItemResponse
}
