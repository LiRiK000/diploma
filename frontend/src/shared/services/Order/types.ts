export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  READY_TO_PICKUP = 'READY_TO_PICKUP',
  ON_HAND = 'ON_HAND',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export interface OrderItem {
  id: string
  bookId: string
  quantity: number
  book: {
    id: string
    title: string
    author: string
    coverImage?: string
  }
}

export interface OrderResponse {
  id: string
  userId: string
  status: OrderStatus
  pickupCode: string | null
  orderDate: string
  dueDate: string
  coverImage?: string
  items: OrderItem[]
}

export interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}
