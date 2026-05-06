export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ON_HAND = 'ON_HAND',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export interface Book {
  id: string
  title: string
  authorId: string
  genreId: string
  availableQuantity: number
  description: string
  subjects: string[]
  publisher: string
  pageCount: number
  language: string
  coverUrl: string
  author?: {
    id: string
    name: string
  }
}

export interface OrderItem {
  id: string
  bookId: string
  quantity: number
  book: Book
}

export interface OrderUser {
  id: string
  name: string
  surname: string
  email: string
  phone?: string | null
  avatarUrl?: string
  level: number
  experience: number
  isInBlacklist: boolean
}

export interface OrderResponse {
  id: string
  status: OrderStatus
  pickupCode: string
  createdAt: string
  dueDate: string
  items: OrderItem[]
  user: OrderUser
}
