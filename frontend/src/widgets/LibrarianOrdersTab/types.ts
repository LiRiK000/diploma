export interface OrderItem {
  id: string
  quantity: number
  book?: {
    title: string
    coverUrl?: string
    publisher?: string
    author?: {
      firstName: string
      lastName: string
    }
    genre?: {
      label: string
    }
  }
}

export interface OrderResponse {
  id: string
  status: string
  orderDate: string
  dueDate: string
  pickupCode?: string

  user?: {
    name: string
    surname: string
    email: string
    avatarUrl?: string
    role?: string
  }

  items: OrderItem[]
}
